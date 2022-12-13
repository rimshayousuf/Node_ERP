const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;

    let REQ = await SeqFunc.getOne(
      req.dbconn.INV_RequisitionMaster,
      {
        where: { TransNo: TransNo },
      }
    );

    if (REQ.success) {
      await req.dbconn.INV_RequisitionMaster.update({
        Status: 1,
        StatusDesc: 'Submitted',
        PostedUser:req.headers.username,
        postedAt:new Date()
      },
      {
        where: { TransNo: TransNo },
      })
      ResponseLog.Send200(req, res, "Record Submitted Successfully");
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    console.log(err)
    ResponseLog.Error200(req, res, "Error Saving Record!");
  }
};
