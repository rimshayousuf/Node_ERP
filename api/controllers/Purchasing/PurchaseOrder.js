const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const UpdateData = require("../../../core/UpdateParallelData");
const Post = require("./PostOrder");
const con = require("../../../AppConfig")


exports.getList = async (req, res) => {
  try {

    let Columns = ["TransNo", "TransDate", "Vendor", "Location", ["TotalR", "Total"], "Description", ["StatusR","Status"], ["SubmittedBy", "Submitted By"]];
    let PO = await SeqFunc.getAll(
      req.dbconn.POP_OrderMaster,
      { order: [["createdAt", "DESC"]] },
      true,
      Columns
    );
    if (PO.success) {

      PO.Data.rows.map((val) => {
        val.StatusR = val.Status ? "Submitted" : "Pending";
        val.SubmitStatus = val.Status
        val.Posted = val.SubmitStatus
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.TotalAmount)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.SubmittedBy = val.Status ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

        return val;
      });

      ResponseLog.Send200(req, res, PO.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let PO = await SeqFunc.getOne(req.dbconn.POP_OrderMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (PO.success) {
      let Detail = await req.dbconn.POP_OrderDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "OLineSeq",
          "RTransNo",
          "RLineSeq",
          "ItemCode",
          "Item",
          "ItemTrackBy",
          "ItemType",
          "TaxScheduleCode",
          "TaxSchedule",
          "UOMCode",
          "UOM",
          "UnitQuantity",
          "Quantity",
          "BaseQuantity",
          "Price",
          "SubTotal",
          "SubTotal_Cur",
          "TaxAmount",
          "TaxAmount_Cur",
          "TotalAmount",
          "TotalAmount_Cur",
          "LineDescription",
        ],
      });

      let Taxes = await SeqFunc.getAll(
        req.dbconn.POP_OrderTaxes,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "RLineSeq",
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

      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })


      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail)

      Detail.map((val) => {
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)
        val.Taxes = Taxes.Data.filter((o) => Number(o.OLineSeq) === Number(val.OLineSeq));

        return val;
      });

      let Data = {
        Header: PO.Data,
        Detail: Detail,
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
    let PO = await SeqFunc.getOne(req.dbconn.POP_OrderMaster, {
      where: { TransNo: req.query.TransNo, SubmitStatus: false },
    });

    if (PO.success) {
      await SeqFunc.Delete(req.dbconn.POP_OrderTaxes, {
        where: { TransNo: PO.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.POP_OrderDetail, {
        where: { TransNo: PO.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.POP_OrderMaster, {
        where: { TransNo: PO.Data.TransNo },
      });
      await UpdateData.executeData(req);

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
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.PostedUser = req.headers.username;

    Header.StatusDesc = Header.SubmitStatus ? "Submitted" : "Pending";
    Header.Status = Header.SubmitStatus
    

    let POData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.POP_OrderMaster,
      req.dbconn.POP_NextNo,

      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (POData.success) {
      let LineSeq = 1;
      let TaxArray = []
      Detail = Detail.filter(v => v.ItemCode !== '')

      Detail.map((o) => {
        delete o.RID;
        o.TransNo = POData.Data.TransNo;
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
        req.dbconn.POP_OrderDetail,
        { where: { TransNo: POData.Data.TransNo }, transaction: t },
        Detail,
        t
      );
      console.log({ DetailData })
      if (DetailData.success) {
        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.POP_OrderTaxes,
          { where: { TransNo: POData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success) {
        await t.commit();
        await UpdateData.executeData(req);
        if (Header.SubmitStatus) {
          req.body.Header['TransNo'] = POData.Data.TransNo
          Post.postData(req, res);
        } else {
          if (POData.created) {
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
    // t.rollback();
    ResponseLog.Error200(req, res, "Error Saving Record!");
  }
};

exports.postingData = async (req, res) => {
  try {
    Post.postData(req, res);
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
