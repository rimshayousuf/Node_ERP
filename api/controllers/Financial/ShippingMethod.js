const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
       
        let Columns = [["ShippingMethodCode", "Shipping Code"], ["ShippingMethodDesc", "Shipping Desc"],"IsActive"]
        let ShippingMethod = await SeqFunc.getAll(req.dbconn.FIN_ShippingMethods, { where:{ } }, true, Columns);
        if (ShippingMethod.success) {
            ResponseLog.Send200(req, res, ShippingMethod.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let ShippingMethod = await SeqFunc.getOne(
            req.dbconn.FIN_ShippingMethods,
            { where: { ShippingMethodCode: req.query.ShippingMethodCode } }
        );

        if (ShippingMethod.success) {
            ResponseLog.Send200(req, res, ShippingMethod.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let ShippingMethod = await SeqFunc.Delete(
            req.dbconn.FIN_ShippingMethods,
            { where: { ShippingMethodCode: req.query.ShippingMethodCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  } }
        );

        if (ShippingMethod.success) {
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

        let ShippingMethod = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_ShippingMethods,
            { where: { ShippingMethodCode: Header.ShippingMethodCode } },
            Header
        );

        if (ShippingMethod.success) {
            if (ShippingMethod.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
