const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
        let Columns = [["VendProfileCode","Profile Code"],["VendProfileDesc","Profile Desc"], ["IsActive","Active"]]
        let RespData = await SeqFunc.getAll(req.dbconn.FIN_VendorProfiles, {}, true, Columns);
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
            req.dbconn.FIN_VendorProfiles,
            { where: { VendProfileCode: req.query.VendProfileCode } }
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
            req.dbconn.FIN_VendorProfiles,
            { where: { VendProfileCode: req.query.VendProfileCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] } } }
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

        delete Header.VendProfileID;

        let RespData = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_VendorProfiles,
            { where: {   VendProfileCode: Header.VendProfileCode } },
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
