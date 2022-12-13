const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const { NextNo } = require("../../../core/GenerateNextNo");
const Post = require('./PostJournalEntry');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const con = require("../../../AppConfig")

exports.getList = async (req, res) => {
    try {
        let Columns = ["TransNo", "TransDate", ["CurDesc", "Currency"],
            ["TotalR", "Total Amount"], "Description", ["RStatus", "Status"], ["PostedBy", "Posted By"]]

        let Journal = await SeqFunc.getAll(req.dbconn.FIN_Journals, { where: { TransType: 'JV' },order:[["createdAt","DESC"]] }, true, Columns);

        Journal.Data.rows.map(v => {
            v.Posted = (v.JrnlStatus === 'POSTED' || v.JrnlStatus === 'Posted') ? 1 : 0;
            v.Description = v.JrnlDesc;
            v.RStatus = v.JrnlStatus;
            v.TransDate = con.MomentformatDate(v.JrnlDate)
            v.TotalR = con.currencyFormat(v.JrnlTotDr)

            v.CreatedBy = v.CreatedUser + ' ' + con.MomentformatDateTime(v.createdAt);
            v.PostedBy = (v.JrnlStatus === 'POSTED' || v.JrnlStatus === 'Posted') ? v.PostedUser + ' ' + con.MomentformatDateTime(v.postedAt) : "";
            return v;
        })

        if (Journal.success) {
            ResponseLog.Send200(req, res, Journal.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        let Journal = await SeqFunc.getOne(
            req.dbconn.FIN_Journals,
            { where: { TransNo: req.query.TransNo } }
        );

        if (Journal.success) {
            let Lines = await SeqFunc.getAll(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: Journal.Data.JrnlID } },
                false,
                [],
            );

            Lines.Data.map(lines => {
                lines.CurSymbol = Journal.Data.CurSymbol
                return lines
            })

            let response = {
                Header: Journal.Data,
                Detail: Lines.Data
            };
            ResponseLog.Send200(req, res, response);

        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let Journal = await SeqFunc.getOne(
            req.dbconn.FIN_Journals,
            { where: { TransNo: req.query.TransNo, JrnlStatus: { [Op.notIn]: ["Posted", "POSTED"] } } }
        );

        if (Journal.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: Journal.Data.JrnlID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Journals,
                { where: { JrnlID: Journal.Data.JrnlID } }
            );
            ResponseLog.Delete200(req, res);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }

    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.CreateOrUpdate = async (req, res) => {
    const t = await req.dbconn.sequelize.transaction();
    try {
        let Header = req.body.Header;
        let Detail = req.body.Detail;

        Header.CreatedUser = req.headers.username;
        Header.ModifyUser = req.headers.username;
        Header.JType = "JV";
        Header.JrnlCreateDate = new Date()
        Header.PostedUser = Header.Posted ? req.headers.username : ''
        Header.JrnlStatus = Header.Posted ? 'Posted' : 'Un-Posted'
        const LineArray = []


        let JournalData = await SeqFunc.Trans_updateOrCreate(
            req.dbconn,
            req.dbconn.FIN_Journals,
            req.dbconn.FIN_NextNo,
            {
                where: { TransNo: Header.TransNo ? Header.TransNo : "" },
                transaction: t,
            },
            Header,
            t
        );

        if (JournalData.success) {

            let FilterDetail = Detail.filter(
                (val) => val.AcctCode !== undefined || val.AcctCode !== ''
            );
            FilterDetail.map(async (val) => {

                let query = {
                    JrnlID: JournalData.Data.JrnlID,
                    AcctCode: val.AcctCode,
                    AcctDesc: val.AcctDesc,
                    LineDr: val.LineDr,
                    LineCr: val.LineCr,
                    LineDrCur: val.LineDrCur,
                    LineCrCur: val.LineCrCur,
                    JobCode: val.JobCode,
                    JobDesc: val.JobDesc,
                    TaxCode: val.TaxCode,
                    TaxDesc: val.TaxDesc,
                    LineDesc: val.LineDesc,
                    TaxDr: 0.0,
                    TaxCr: 0.0,
                    TaxDrCur: 0.0,
                    TaxCrCur: 0.0,
                    TaxLine: 0,
                    Recon: 0,
                    ReconDate: null,
                    LoanID: null,
                };
                if (val.AcctCode !== '') {
                    LineArray.push(query);
                }
            })

            let Lines = await SeqFunc.Trans_bulkCreate(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: JournalData.Data.JrnlID }, transaction: t },
                LineArray,
                t
            );
            if (Lines.success) {

                await t.commit()

                if (Header.Posted) {
                    Post.postData(req.dbconn.FIN_Journals, req, res)
                }
                else {
                    if (JournalData.created) {
                        ResponseLog.Send200(req, res, "Record Created Successfully!");
                    } else {
                        ResponseLog.Send200(req, res, "Record Updated Successfully!");
                    }
                }

            }
            else {
                t.rollback();
                ResponseLog.Error200(req, res, "Error Saving Record!");
            }
        } else {
            t.rollback();
            ResponseLog.Error200(req, res, "Error Saving Record!");
        }
    } catch (err) {
        t.rollback();
        console.log(err)
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.postingData = async (req, res) => {
    try {
        Post.postData(req.dbconn.FIN_Journals, req, res)
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
