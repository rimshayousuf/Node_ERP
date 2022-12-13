const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["CustCatCode", "Category Code"], ["CustCat", "Category Desc"], ["IsActive", "Status"]]
        let CusCategory = await SeqFunc.getAll(req.dbconn.FIN_CustomerCategories, { where:{ } }, true, Columns);
        if (CusCategory.success) {
            ResponseLog.Send200(req, res, CusCategory.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let CusCategory = await SeqFunc.getOne(
            req.dbconn.FIN_CustomerCategories,
            { where: { CustCatCode: req.query.CustCatCode } }
        );

        if (CusCategory.success) {
            ResponseLog.Send200(req, res, CusCategory.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let CusCategory = await SeqFunc.Delete(
            req.dbconn.FIN_CustomerCategories,
            { where: { CustCatCode: req.query.CustCatCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  } }
        );

        if (CusCategory.success) {
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

        let CusCategory = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_CustomerCategories,
            { where: { CustCatCode: Header.CustCatCode } },
            Header
        );

        if (CusCategory.success) {
            if (CusCategory.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
