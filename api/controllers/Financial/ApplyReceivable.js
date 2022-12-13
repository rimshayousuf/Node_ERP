const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.CreateOrUpdate = async (req, res) => {
    try {
        let Header = req.body.Header;
        let Detail = req.body.Detail
        let AppArray = [];


        Detail.map((val) => {
            var Item = {
                SaleID: val.SaleID,
                RecID: val.RecID,
                AplAmount: val.AplAmount,
                AplDisc: val.AplDisc,
                SaleType: val.TransType,
                RecType: req.body.Header.TransType
            }
            AppArray.push(Item)
        })

        await SeqFunc.Delete(
            req.dbconn.FIN_SalesApp,
            { where: { RecID: Header.RecID } },
        );
        let RespData = await SeqFunc.bulkCreate(
            req.dbconn.FIN_SalesApp,
            AppArray
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
