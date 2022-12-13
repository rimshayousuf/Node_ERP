const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
        let Columns = ["AcctCode", "AcctDesc", "AcctType", "Category", "TypBal"]
        let RespData = await SeqFunc.getAll(req.dbconn.FIN_CodeCombination, {}, true, Columns);
        if (RespData.success) {
            ResponseLog.Send200(req, res, RespData.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let RespData = await SeqFunc.getOne(
            req.dbconn.FIN_CodeCombination,
            { where: { AcctCode: req.query.AcctCode } }
        );

        if (RespData.success) {
            ResponseLog.Send200(req, res, RespData.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let RespData = await SeqFunc.Delete(
            req.dbconn.FIN_CodeCombination,
            { where: { AcctCode: req.query.AcctCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] } } }
        );

        if (RespData.success) {
            ResponseLog.Delete200(req, res);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.CreateOrUpdate = async (req, res) => {
    try {
        let Header = req.body.Header;

        let RespData = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_CodeCombination,
            { where: { AcctCode: Header.AcctCode } },
            Header
        );

        if (RespData.success) {
            if (RespData.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
