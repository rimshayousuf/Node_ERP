const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const con = require("../../../AppConfig")
const Post = require('./PostDonorReceipts');


exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo", "TransDate", "DonorName", "Remarks",["RStatus", "Status"], ["AmountR", "Amount"], "PostedBy"]
    let RespData = await SeqFunc.getAll(req.dbconn.FIN_DonorReceipts, {}, true, Columns);
    console.log({ RespData })

    if (RespData.success) {
      RespData?.Data?.rows?.map((val) => {
        val.RStatus = val.Status ? "Posted" : "Un-Posted";
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.AmountR = con.currencyFormat(val.Amount)
        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.PostedBy = val.Status === 1 ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

        return val;
      });
      ResponseLog.Send200(req, res, RespData.Data);
    } else {
      ResponseLog.Send200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {

    let RespData = await SeqFunc.getOne(req.dbconn.FIN_DonorReceipts, { where: { TransNo: req.query.TransNo } });

    if (RespData.success) {

      let JVData = await SeqFunc.getAll(
        req.dbconn.FIN_Distribution,
        { where: { TransNo: RespData.Data.TransNo, TransType: 'DR' } },
        false,
        [],
    );

    console.log({JVData})


      ResponseLog.Send200(req, res, { Header: RespData.Data, JVData:JVData.Data });
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let RespData = await SeqFunc.Delete(req.dbconn.FIN_DonorReceipts, { where: { TransNo: req.query.TransNo } });

    if (RespData.success) {
      ResponseLog.Delete200(req, res);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.CreateOrUpdate = async (req, res) => {
  const t = await req.dbconn.sequelize.transaction();
  try {
    let Header = req.body.Header;
    let Detail = req.body.JVData;
    delete Header.RID
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.TransType = "DR"

    let RespData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.FIN_DonorReceipts,
      req.dbconn.FIN_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );


    if (RespData.success) {

      Detail.map(v => {
        delete v.RID
        v.TransNo = RespData.Data.TransNo
        v.TransType = 'DR'
        return v;
      })

      let JVDist = await SeqFunc.Trans_bulkCreate(
        req.dbconn.FIN_Distribution,
        { where: { TransNo: RespData.Data.TransNo, TransType: 'DR' }, transaction: t },
        Detail,
        t
      );

      if (JVDist.success == true) {
        t.commit();
        console.log({Header})
        if (Header.Status == true) {
          Post.postData(req, res)
        }
        else {

          if (RespData.created) {
            ResponseLog.Create200(req, res);
          } else {
            ResponseLog.Update200(req, res);
          }
        }
      } else {
        t.rollback()
        ResponseLog.Error200(req, res, "Error generating Distribution!");
      }

    }
  } catch (err) {
    t.rollback()
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.postingData = async (req, res) => {
  try {
    Post.postData(req, res)
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
