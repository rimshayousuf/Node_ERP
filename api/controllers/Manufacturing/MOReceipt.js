const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostMOReceipt");

exports.getList = async (req, res) => {
  try {
    let Columns = [
      "TransNo","TransDate",["MOTransNo","MO No"],"Item","UOM","Quantity"
    ];
    let MOReceipt = await SeqFunc.getAll(
      req.dbconn.MOP_Receipt,
      {},
      true,
      Columns
    );
    if (MOReceipt.success) {
      ResponseLog.Send200(req, res, MOReceipt.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let MOReceipt = await SeqFunc.getOne(req.dbconn.MOP_Receipt, {
      where: { TransNo: req.query.TransNo },
    });

    if (MOReceipt.success) {
      let Detail = await SeqFunc.getAll(
        req.dbconn.MOP_ReceiptDetail,
        { where:{ReceiptID: MOReceipt.Data.ReceiptID} },
        false,
        ["CItemCode","CItem","UOMCode","UOM","Quantity","StageCode","StageName"]
      );

      let Data = {
        Header: MOReceipt.Data,
        Detail: Detail.Data,
      };

      ResponseLog.Send200(req, res, Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let MOReceipt = await SeqFunc.getOne(
      req.dbconn.MOP_Receipt,
      { where: { TransNo: req.query.TransNo, Posted: false } },
      Header
    );

    if (MOReceipt.success) {
      await SeqFunc.Delete(req.dbconn.MOP_Receipt, {
        where: { ReceiptID: MOReceipt.Data.ReceiptID },
      });
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
    let Detail = req.body.Detail;
    delete Header.ReceiptID;

    Header.CreatedUser = '1'
    Header.ModifyUser = '1'
    Header.TransStatus = '1'

    let MOReceiptData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.MOP_Receipt,
      req.dbconn.MOP_NextNo,
      { where: { TransNo: Header.TransNo ? Header.TransNo : '' },transaction:t },
      Header,
      t
    );

    if (MOReceiptData.success) {
      Detail.map((o) => {
        o.ReceiptID = MOReceiptData.Data.ReceiptID
        delete o.ReceiptLineID
        return o
      });

      let MORctDData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.MOP_ReceiptDetail,
        { where: { ReceiptID: MOReceiptData.Data.ReceiptID },transaction:t },
        Detail,
        t
      );
      if (MORctDData.success) {
        await req.dbconn.MOP_MOHeader.update({MOStatus: 'Completed'},{ where: { TransNo: MOReceiptData.Data.MOTransNo },transaction:t })
        t.commit();
        req.body.Header['TransNo'] = MOReceiptData.Data.TransNo
        await Post.postData(req, res);
      } else {
        t.rollback();
        ResponseLog.Error200(req, res, "Error Saving Record!");
      }
    } else {
      t.rollback();
      ResponseLog.Error200(req, res, "Error Saving Record!");
    }
  } catch (err) {
    console.log(err)
    t.rollback();
    ResponseLog.Error200(req, res, err.message);
  }
};