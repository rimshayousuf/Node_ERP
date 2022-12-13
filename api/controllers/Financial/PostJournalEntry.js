const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const con = require("../../../AppConfig")


exports.postData = async (model, req, res) => {
  try {

    let Trans = await SeqFunc.getOne(
      model,
      {
        where: { TransNo: req.body.Header.TransNo },
      }
    );

    let JE = await SeqFunc.getOne(
      req.dbconn.FIN_Journals,
      {
        where: { JrnlID: Trans.Data.JrnlID },
      }
    );

    if (JE.success) {
      console.log({Date:con.MomentformatDateTime(new Date())})

      await req.dbconn.FIN_Journals.update({
        Posted: 1,
        JrnlStatus: 'Posted',
        PostedUser:req.headers.username,
        postedAt: con.MomentformatDateTime(new Date())
      },
      {
        where: { JrnlID: Trans.Data.JrnlID },
      })
      ResponseLog.Send200(req, res, "Record Posted Successfully");
    } else {

      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    console.log({err})
    ResponseLog.Error200(req, res, err.message);
  }
};
