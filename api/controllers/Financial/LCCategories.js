const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["CatCode", "Category Code"], ["CatDesc", "Category Name"], ["IsActive", "Status"]]
        let LCCategories = await SeqFunc.getAll(req.dbconn.FIN_LCCategories, { where:{ } }, true, Columns);
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

        let LCCategory = await SeqFunc.getOne(
            req.dbconn.FIN_LCCategories,
            { where: { CatCode: req.query.CatCode } }
        );

        if (LCCategory.success) {
            ResponseLog.Send200(req, res, LCCategory.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let LCCategory = await SeqFunc.Delete(
            req.dbconn.FIN_LCCategories,
            { where: { CatCode: req.query.CatCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] } } }
        );

        if (LCCategory.success) {
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

        let LCCategory = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_LCCategories,
            { where: { CatCode: Header.CatCode } },
            Header
        );

        if (LCCategory.success) {
            if (LCCategory.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
