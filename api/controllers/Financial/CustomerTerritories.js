const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["CustTerCode", "Territory Code"], ["CustTer", "Territory Desc"], ["IsActive", "Status"]]
        let LCCategories = await SeqFunc.getAll(req.dbconn.FIN_CustomerTerritories, { where:{ } }, true, Columns);
        if (LCCategories.success) {
            ResponseLog.Send200(req, res, LCCategories.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let CusTerritory = await SeqFunc.getOne(
            req.dbconn.FIN_CustomerTerritories,
            { where: { CustTerCode: req.query.CustTerCode } }
        );

        if (CusTerritory.success) {
            ResponseLog.Send200(req, res, CusTerritory.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let CusTerritory = await SeqFunc.Delete(
            req.dbconn.FIN_CustomerTerritories,
            { where: { CustTerCode: req.query.CustTerCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  } }
        );

        if (CusTerritory.success) {
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

        let CusTerritory = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_CustomerTerritories,
            { where: { CustTerCode: Header.CustTerCode } },
            Header
        );

        if (CusTerritory.success) {
            if (CusTerritory.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
