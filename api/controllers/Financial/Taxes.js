const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["TaxCode", "Tax Code"], ["TaxDesc", "Description"]]
        let Tax = await SeqFunc.getAll(req.dbconn.FIN_Taxes, { where:{ } }, true, Columns);
        if (Tax.success) {
            ResponseLog.Send200(req, res, Tax.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let Tax = await SeqFunc.getOne(
            req.dbconn.FIN_Taxes,
            { where: { TaxCode: req.query.TaxCode } }
        );

        if (Tax.success) {
            ResponseLog.Send200(req, res, Tax.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let Tax = await SeqFunc.Delete(
            req.dbconn.FIN_Taxes,
            { where: { TaxCode: req.query.TaxCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  } }
        );

        if (Tax.success) {
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

        let Tax = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_Taxes,
            { where: { TaxCode: Header.TaxCode } },
            Header
        );

        if (Tax.success) {
            if (Tax.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
