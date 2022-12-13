const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const { NextNo } = require("../../../core/GenerateNextNo");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Post = require('./PostBankTransfer');
const con = require("../../../AppConfig")

exports.getList = async (req, res) => {
    try {

        let Columns = ["TransNo", "TransDate", ["SrcCurDesc", "Currency"], ["SrcBankDesc", "Source Bank"],
            ["TotalR", "Total Amount"], "Description", ["RStatus", "Status"], ["PostedBy", "Posted By"]]


        let BankTransfer = await SeqFunc.getAll(req.dbconn.FIN_BankTransfer, { where: {}, order: [["createdAt", "DESC"]] }, true, Columns);
        if (BankTransfer.success) {
            BankTransfer.Data.rows.map(v => {
                v.RStatus = v.Status === 1 ? 'Posted' : 'Un-Posted';
                v.Description = v.BTrfDesc;
                v.TransDate = con.MomentformatDate(v.BTrfDate)
                v.TotalR = con.currencyFormat(v.SrcBTrfAmount)

                v.CreatedBy = v.CreatedUser + ' ' + con.MomentformatDateTime(v.createdAt);
                v.PostedBy = v.Status === 1 ? v.PostedUser + ' ' + con.MomentformatDateTime(v.postedAt) : "";
                return v;
            })
            ResponseLog.Send200(req, res, BankTransfer.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        let BankTransfer = await SeqFunc.getOne(
            req.dbconn.FIN_BankTransfer,
            { where: { TransNo: req.query.TransNo } }
        );

        if (BankTransfer.success) {

            ResponseLog.Send200(req, res, BankTransfer.Data);

        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let BankTransfer = await SeqFunc.getOne(
            req.dbconn.FIN_BankTransfer,
            { where: { TransNo: req.query.TransNo, Status: 0 } }
        );

        if (BankTransfer.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_BankTransfer,
                { where: { TransNo: req.query.TransNo } },
            );

            ResponseLog.Delete200(req, res);
        } else {
            ResponseLog.Error200(req, res, "Posted transactions can not be deleted.");
        }

    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.CreateOrUpdate = async (req, res) => {
    const t = await req.dbconn.sequelize.transaction();
    try {
        let Header = req.body.Header;

        delete Header.BTrfID

        let BankTransferData = await SeqFunc.Trans_updateOrCreate(
            req.dbconn,
            req.dbconn.FIN_BankTransfer,
            req.dbconn.FIN_NextNo,
            {
                where: { TransNo: Header.TransNo ? Header.TransNo : "" },
                transaction: t,
            },
            Header,
            t
        );

        if (BankTransferData.success) {
            t.commit();
            if (Header.Status) {
                Post.postData(req, res)
            }
            else {
                if (BankTransferData.created) {
                    ResponseLog.Send200(req, res, "Record Created Successfully!");
                } else {
                    ResponseLog.Send200(req, res, "Record Updated Successfully!");
                }
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
        Post.postData(req, res)
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};