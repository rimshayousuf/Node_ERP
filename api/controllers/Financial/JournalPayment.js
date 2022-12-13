const db = require("../../models/index");
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
        let Columns = ["TransNo", "TransDate", ["CurDesc", "Currency"],
            ["TotalR", "Total Amount"], "Description", ["RStatus", "Status"], ["PostedBy", "Posted By"]]

        let Journal = await SeqFunc.getAll(req.dbconn.FIN_Journals, { where: { Transtype: 'PV' }, order: [["createdAt", "DESC"]] }, true, Columns);

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
                { where: { TransNo: Journal.Data.TransNo, TransType: 'PV' } },
                false,
                [],
            );
            let HeaderLine = []

            Lines = JSON.stringify(Lines)
            Lines = JSON.parse(Lines)

            let LinesArr = []
            await Promise.all(
                Lines?.Data?.map(async lines => {

                    if (lines.LineDr > 0) {
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
                    }
                    return lines
                })
            )
            let LCExpenseDetail = []

            let LCExpenseHeader = await SeqFunc.getOne(
                req.dbconn.FIN_LCExpenseHeader,
                { where: { TransNo: Journal.Data.TransNo } },
                false,
                [],
            );
            if (LCExpenseHeader.success) {
                let LCExpDetail = await SeqFunc.getAll(
                    req.dbconn.FIN_LCExpenseDetail,
                    { where: { HID: LCExpenseHeader.Data.RID } },
                    false,
                    [],
                );
                LCExpenseDetail = LCExpDetail.Data
            }

            let Header = Journal.Data
            if (HeaderLine.length > 0) {
                Header.AcctCode = HeaderLine[0].AcctCode
                Header.AcctDesc = HeaderLine[0].AcctDesc
                Header.JobCode = HeaderLine[0].JobCode
                Header.JobDesc = HeaderLine[0].JobDesc
            }

            let response = {
                Header: Header,
                Detail: LinesArr,
                JVData: JVData.Data,
                LCExpense: {
                    Header: LCExpenseHeader.Data,
                    Detail: LCExpenseDetail
                }
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
                { where: { JrnlID: Journal.Data.JrnlID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Journals,
                { where: { JrnlID: Journal.Data.JrnlID } }
            );

            let LC = await req.dbconn.FIN_LCExpenseHeader.findOne({ where: { TransNo: req.query.TransNo } })

            if (LC) {
                await SeqFunc.Delete(
                    req.dbconn.FIN_LCExpenseDetail,
                    { where: { TransNo: LC.HID } }
                );

                await SeqFunc.Delete(
                    req.dbconn.LCExpenseHeader,
                    { where: { TransNo: req.query.TransNo } }
                );

            }

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
        let LCExpense = req.body.LCExpense
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
                        LineDr: 0.0,
                        LineCr: val.TaxCr,
                        LineDrCur: 0.0,
                        LineCrCur: val.TaxCrCur,
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
                AcctType: 'Cash',
                LineDr: 0.0,
                LineCr: Header.JrnlTotCr - Header.JrnlTaxDr,
                LineDrCur: 0.0,
                LineCrCur: Header.JrnlTotCrCur - Header.JrnlTaxDrCur,
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

            let Lines = await SeqFunc.Trans_bulkCreate(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: JournalData.Data.JrnlID }, transaction: t },
                LineArray,
                t
            );

            if (Lines.success) {

                JVData.map(v => {
                    v.TransNo = JournalData.Data.TransNo
                    v.TransType = 'PV'
                    return v
                })

                let Data1 = JVData.filter(v => v.AcctCode !== "")

                let JVDist = await SeqFunc.Trans_bulkCreate(
                    req.dbconn.FIN_Distribution,
                    { where: { TransNo: JournalData.Data.TransNo, TransType: 'PV' }, transaction: t },
                    Data1,
                    t
                );

                if (req.body.Header.LCAmount > 0 && LCExpense) {
                    let ExpHeader = LCExpense.Header;
                    let ExpDetail = LCExpense.Detail;

                    const ExpH = await SeqFunc.Trans2_updateOrCreate(
                        req.dbconn.FIN_LCExpenseHeader,
                        {
                            LCCode: ExpHeader.LCCode,
                            LCDesc: ExpHeader.LCDesc,
                            TransType: 'PAY',
                            TransNo: JournalData.Data.TransNo,
                            CreatedUser: req.headers.userid
                        },
                        {
                            where: { TransNo: JournalData.Data.TransNo ? JournalData.Data.TransNo : "" },

                        },
                        { transaction: t }
                    )
                    if (ExpH.success) {
                        const dd = ExpDetail.map((d) => {
                            d.HID = ExpH.Data.RID
                            return d;
                        })

                        const ExpD = await SeqFunc.bulkCreate(
                            req.dbconn.FIN_LCExpenseDetail,
                            dd,
                            { transaction: t }
                        );
                        if (ExpD.success) {
                            await t.commit()
                            if (Header.JrnlStatus == 'POSTED') {
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
                    }
                    else {
                        t.rollback();
                        ResponseLog.Error200(req, res, "Error Saving Record!");
                    }


                }
                else {
                    await t.commit()
                    if (Header.JrnlStatus == 'POSTED') {
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
