const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const { NextNo } = require("../../../core/GenerateNextNo");
const { Journal } = require(".");
const Sequelize = require("sequelize");
const { localeData } = require("moment");
const Op = Sequelize.Op;
const Post = require('./PostJournalEntry');
const con = require("../../../AppConfig")



exports.getList = async (req, res) => {
    try {
        // let Columns = [["TransNo", "Ref No"], ["JrnlDate", "Date"], ["CurCode", "Currency"], ["Bank", "BankDesc"],
        // ["JrnlDesc", "Description"], ["JrnlStatus", "Status"], ["Created", "PostedUser"]]

        let Columns = ["TransNo", "TransDate", ["CurDesc", "Currency"],
            ["TotalR", "Total Amount"], "Description", ["RStatus", "Status"], ["PostedBy", "Posted By"]]

        let Journal = await SeqFunc.getAll(req.dbconn.FIN_Journals, { where: { TransType: 'RV' }, order: [["createdAt", "DESC"]] }, true, Columns);

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


            let JVData = await SeqFunc.getAll(
                req.dbconn.FIN_Distribution,
                { where: { TransNo: Journal.Data.TransNo, Transtype: 'RV' } },
                false,
                [],
            );

            let HeaderLine = []

            Lines = JSON.stringify(Lines)
            Lines = JSON.parse(Lines)

            let LinesArr = []
            await Promise.all(
                Lines?.Data?.map(async lines => {
                    if (lines.LineCr > 0) {

                        let Taxes = await req.dbconn.FIN_TaxDetail.findOne({ where: { TaxDetailCode: lines.TaxCode } });

                        lines.TaxAcctCode = Taxes?.AcctCode
                        lines.TaxAcctDesc = Taxes?.AcctDesc
                        lines.CurSymbol = Journal.Data.CurSymbol
                        LinesArr.push(lines)
                    }
                    else {
                        if (lines.TaxLine === false) {
                            HeaderLine.push(lines)
                        }
                        // delete lines
                    }
                    return lines
                })
            )

            let Header = Journal.Data
            if (HeaderLine.length > 0) {
                Header.AcctCode = HeaderLine[0].AcctCode
                Header.AcctDesc = HeaderLine[0].AcctDesc
                Header.JobCode = HeaderLine[0].JobCode
                Header.JobDesc = HeaderLine[0].JobDesc
            }
            console.log({ LinesArr })

            let response = {
                Header: Header,
                JVData: JVData.Data,
                Detail: LinesArr,
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
            { where: { TransNo: req.query.TransNo, JrnlStatus: { [Op.notIn]: ["POSTED", "Posted"] } } }
        );

        if (Journal.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: req.query.JrnlID } }
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
        let JVData = req.body.JVData;

        Header.ModifyUser = 1;
        Header.JrnlCreateDate = new Date()
        Header.PostedUser = Header.Posted ? req.headers.userid : ''
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
                (val) => val.AcctCode !== undefined || val.AcctCode !== null || val.AcctCode !== ""
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
                    TaxRate: val.TaxRate,
                    TaxDesc: val.TaxDesc,
                    LineDesc: val.LineDesc,
                    TaxDr: val.TaxDr,
                    TaxCr: val.TaxCr,
                    TaxDrCur: val.TaxDrCur,
                    TaxCrCur: val.TaxCrCur,
                    TaxLine: 0,
                    Recon: 0,
                    ReconDate: null,
                    LoanID: null,
                };
                if (val.AcctCode !== '') {
                    LineArray.push(query);
                }

                if (val.TaxCode !== "") {
                    let Taxquery = {
                        JrnlID: JournalData.Data.JrnlID,
                        AcctCode: val.TaxAcctCode,
                        AcctDesc: val.TaxAcctDesc,
                        LineDr: val.TaxDr,
                        LineCr: 0,
                        LineDrCur: val.TaxDrCur,
                        LineCrCur: 0,
                        JobCode: "",
                        JobDesc: "",
                        TaxCode: "",
                        TaxDesc: "",
                        TaxRate: 0.0,
                        LineDesc: "",
                        TaxDr: 0,
                        TaxCr: 0,
                        TaxDrCur: 0,
                        TaxCrCur: 0,
                        TaxLine: 1,
                        Recon: 0,
                        ReconDate: null,
                        LoanID: null,
                    };
                    if (val.AcctCode !== '') {
                        LineArray.push(Taxquery);
                    }
                }
            })

            let HQuery = {
                JrnlID: JournalData.Data.JrnlID,
                AcctCode: Header.AcctCode,
                AcctDesc: Header.AcctDesc,
                LineDr: Header.JrnlTotDr - Header.JrnlTaxCr,
                LineCr: 0.0,
                LineDrCur: Header.JrnlTotDrCur - Header.JrnlTaxCrCur,
                LineCrCur: 0.0,
                JobCode: "",
                JobDesc: "",
                TaxCode: "",
                TaxDesc: "",
                TaxRate: 0.0,
                LineDesc: "",
                TaxDr: 0,
                TaxCr: 0,
                TaxDrCur: 0,
                TaxCrCur: 0,
                TaxLine: 0,
                Recon: 0,
                ReconDate: null,
                LoanID: null,
            };
            LineArray.push(HQuery);

            const Lines = await SeqFunc.Trans_bulkCreate(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: JournalData.Data.JrnlID }, transaction: t },
                LineArray,
                t
            );

            if (Lines.success) {

                JVData.map(v => {
                    v.TransNo = JournalData.Data.TransNo
                    v.TransType = 'RV'
                    return v
                })

                let Data1 = JVData.filter(v => v.AcctCode !== "")

                let JVDist = await SeqFunc.Trans_bulkCreate(
                    req.dbconn.FIN_Distribution,
                    { where: { TransNo: JournalData.Data.TransNo, TransType: 'RV' }, transaction: t },
                    Data1,
                    t
                );

                await t.commit()

                if (JournalData.created) {
                    ResponseLog.Send200(req, res, "Record Created Successfully!");
                } else {
                    ResponseLog.Send200(req, res, "Record Updated Successfully!");
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