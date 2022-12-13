const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["CPCode", "Profile Code"], ["CP", "Profile Desc"], ["IsActive", "Status"]]
        let CustProfile = await SeqFunc.getAll(req.dbconn.FIN_CustomerProfiles, { where:{ } }, true, Columns);
        if (CustProfile.success) {
            ResponseLog.Send200(req, res, CustProfile.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let CustProfile = await SeqFunc.getOne(
            req.dbconn.FIN_CustomerProfiles,
            { where: { CPCode: req.query.CPCode } }
        );

        if (CustProfile.success) {
            ResponseLog.Send200(req, res, CustProfile.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let CustProfile = await SeqFunc.Delete(
            req.dbconn.FIN_CustomerProfiles,
            { where: { CPCode: req.query.CPCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  } }
        );

        if (CustProfile.success) {
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

        let CustProfile = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_CustomerProfiles,
            { where: { CPCode: Header.CPCode } },
            Header
        );

        if (CustProfile.success) {
            if (CustProfile.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
