const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["LCCode", "LC Code"], ["LCDesc", "LC Description"], ["BankName", "Bank Name"], ["VendorName", "Vendor Name"], ["IsActive", "Status"]]
        let LCCodes = await SeqFunc.getAll(req.dbconn.FIN_LCCodes, { where:{ } }, true, Columns);
        if (LCCodes.success) {
            ResponseLog.Send200(req, res, LCCodes.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let LCCodes = await SeqFunc.getOne(
            req.dbconn.FIN_LCCodes,
            { where: { LCCode: req.query.LCCode } }
        );

        if (LCCodes.success) {
            ResponseLog.Send200(req, res, LCCodes.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let LCCodes = await SeqFunc.Delete(
            req.dbconn.FIN_LCCodes,
            { where: { LCCode: req.query.LCCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  } }
        );

        if (LCCodes.success) {
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

        let LCCodes = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_LCCodes,
            { where: { LCCode: Header.LCCode } },
            Header
        );

        if (LCCodes.success) {
            if (LCCodes.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
