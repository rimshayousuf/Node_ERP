const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");

exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;
    let REQ = await SeqFunc.getOne(req.dbconn.INV_TransferHeader, {
      where: { TransNo: TransNo },
    });

    if (REQ.success) {
      await Stock.Addition.Addition(
        req.dbconn,
        req.dbconn.INV_TransferDetail,
        TransNo,
        REQ.Data.DestinationLocationCode,
        REQ.Data.DestinationLocation,
        REQ.Data.TransType,
        0,
        0,
        res
      );

      await req.dbconn.INV_TransferHeader.update(
        {
          Posted: 1,
          PostedUser: req.headers.username,
          postedAt: new Date(),
        },
        {
          where: { TransNo: TransNo },
        }
      );
      ResponseLog.Send200(req, res, "Record Posted Successfully");
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
