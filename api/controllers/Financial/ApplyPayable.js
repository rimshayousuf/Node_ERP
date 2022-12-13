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
                PurID: val.PurID,
                PayID: val.PayID,
                AplAmount: val.AplAmount,
                AplDisc: val.AplDisc,
                PayType: val.TransType,
                PurType: Header.TransType
            }
            AppArray.push(Item)
        })
        await SeqFunc.Delete(
            req.dbconn.FIN_PurApplication,
            { where: { PayID: Header.PayID } },
        );


        let RespData = await SeqFunc.bulkCreate(
            req.dbconn.FIN_PurApplication,
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
