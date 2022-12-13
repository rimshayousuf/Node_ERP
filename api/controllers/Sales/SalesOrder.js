const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostOrder");

const con = require("../../../AppConfig");
const UpdateData = require("../../../core/UpdateParallelData");

exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo","TransDate", "Customer" , "Location",["TotalR","Total"], "Description", "Status" , ["SubmittedBy", "Submitted By"]];


    console.log()
    let SO = await SeqFunc.getAll(
      req.dbconn.SOP_OrderMaster,
      {},
      true,
      Columns
    );
    if (SO.success) {
      SO.Data.rows.map((val) => {
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.TransTotal)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.SubmittedBy = val.SubmitStatus ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";
        
        val.Status = val.SubmitStatus ? "Submitted" : "Pending";
        return val;
      });

      ResponseLog.Send200(req, res, SO.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let SO = await SeqFunc.getOne(req.dbconn.SOP_OrderMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (SO.success) {
      let Detail = await req.dbconn.SOP_OrderDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "OLineSeq",
          "QTransNo",
          "QLineSeq",
          "ItemCode",
          "Item",
          "ItemTrackBy",
          "ItemType",
          "UOMCode",
          "UOM",
          "UnitQuantity",
          "Quantity",
          "BaseQuantity",
          "Price",
          "Amount",
          "Amount_Cur",
          "TaxScheduleCode",
          "TaxSchedule",
          "TaxAmount",
          "TaxAmount_Cur",
          "NetAmount",
          "NetAmount_Cur",
          "Remarks",
        ],
      });

      let Taxes = await SeqFunc.getAll(
        req.dbconn.SOP_OrderTaxes,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "OLineSeq",
          "ItemCode",
          "Item",
          "TaxScheduleID",
          "TaxScheduleCode",
          "TaxSchedule",
          "TaxDetailID",
          "TaxDetailCode",
          "TaxDetail",
          "TaxRate",
          "TaxAmount",
          "TaxAmount_Cur",
        ]
      );
      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail) 

      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })

      Detail.map((val) => {
        val.Taxes = Taxes.Data.filter((o) => o.OLineSeq === val.OLineSeq && o.TransNo === val.TransNo);
        val.UOMArray = UOMData.filter((o) => o.ItemCode === val.ItemCode);
        return val;
      });

      let Data = {
        Header: SO.Data,
        Detail: Detail,
      };

      ResponseLog.Send200(req, res, Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    console.log({err})
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let SO = await SeqFunc.getOne(req.dbconn.SOP_OrderMaster, {
      where: { TransNo: req.query.TransNo, SubmitStatus: false },
    });

    if (SO.success) {
      await SeqFunc.Delete(req.dbconn.SOP_OrderTaxes, {
        where: { TransNo: SO.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_OrderDetail, {
        where: { TransNo: SO.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_OrderMaster, {
        where: { TransNo: SO.Data.TransNo },
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
    delete Header.RID;
    Header.CreatedUser = 1;
    Header.ModifyUser = 1;
    Header.PostedUser = 1;
    Header.PromiseDate = new Date();

    let SOData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.SOP_OrderMaster,
      req.dbconn.SOP_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (SOData.success) {
      let LineSeq = 1;
      let TaxArray = [];

      Detail.map((o) => {
        delete o.RID;
        o.TransNo = SOData.Data.TransNo;
        o.OLineSeq = LineSeq;
        o.Taxes?.map((l) => {
          delete l.RID;
          l.TransNo = o.TransNo;
          l.ItemCode = o.ItemCode;
          l.Item = o.Item;
          l.TaxScheduleID = o.TaxScheduleID;
          l.TaxScheduleCode = o.TaxScheduleCode;
          l.TaxSchedule = o.TaxSchedule;

          l.OLineSeq = o.OLineSeq;
          TaxArray.push(l)
          return l;
        });
        
        LineSeq++;
        return o;
      });

      let DetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.SOP_OrderDetail,
        { where: { TransNo: SOData.Data.TransNo }, transaction: t },
        Detail,
        t
      );

      if (DetailData.success) {
        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.SOP_OrderTaxes,
          { where: { TransNo: SOData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success) {
          await t.commit();
          await UpdateData.executeData(req);

          if (Header.SubmitStatus) {
            req.body.Header['TransNo'] = SOData.Data.TransNo

            Post.postData(req, res);
          } else {
            if (SOData.created) {
              ResponseLog.Create200(req, res);
            } else {
              ResponseLog.Update200(req, res);
            }
          }
        } else {
          t.rollback();
          ResponseLog.Error200(req, res, "Error Saving Record!");
        }
      } else {
        t.rollback();
        ResponseLog.Error200(req, res, "Error Saving Record!");
      }
    } else {
      t.rollback();
      ResponseLog.Error200(req, res, "Error Saving Record!");
    }
  } catch (err) {
    t.rollback();
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.postingData = async (req, res) => {
  try {
    Post.postData(req, res);
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
