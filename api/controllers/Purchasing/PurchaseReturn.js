const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostReturn");
const con = require("../../../AppConfig");
const UpdateData = require("../../../core/UpdateParallelData");
const Stock = require("../../../core/Stock");




exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo", "TransDate", "Vendor", "Location", ["TotalR", "Total"], "Description", ["RPosted", "Status"], ["PostedBy", "Posted By"]];

    let Invoice = await SeqFunc.getAll(
      req.dbconn.POP_ReturnMaster,
      {},
      true,
      Columns
    );
    if (Invoice.success) {
      Invoice.Data.rows.map((val) => {
        val.RPosted = val.Posted ? "Posted" : "Un-Posted";
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.Total)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.PostedBy = val.Posted ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

        return val;
      });

      ResponseLog.Send200(req, res, Invoice.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let Invoice = await SeqFunc.getOne(req.dbconn.POP_ReturnMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (Invoice.success) {
      let Detail = await req.dbconn.POP_ReturnDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "RLineSeq",
          "GLineSeq",
          "GTransNo",
          "ItemCode",
          "Item",
          "ItemType",
          "ItemTrackBy",
          "TaxScheduleID",
          "TaxScheduleCode",
          "TaxSchedule",
          "JobCode",
          "JobDesc",
          "UOMCode",
          "UOM",
          "UnitQuantity",
          "Price",
          "Quantity",
          "BaseQuantity",
          "Amount",
          "Amount_Cur",
          "TaxAmount",
          "TaxAmount_Cur",
          "NetAmount",
          "NetAmount_Cur",
          "Remarks"
        ],
      });

      let Taxes = await SeqFunc.getAll(
        req.dbconn.POP_ReturnTaxes,
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

      let Batches = await SeqFunc.getAll(
        req.dbconn.POP_ReturnBatches,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "RLineSeq",
          "BatchNo",
          "ExpiryDate",
          "Quantity",
          "BaseQuantity"
        ]
      );

      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail)

      Detail.map((val) => {
        val.Taxes = Taxes.Data.filter((o) => Number(o.RLineSeq) === Number(val.RLineSeq));
        val.Batches = Batches.Data.filter((o) => Number(o.RLineSeq) === Number(val.RLineSeq));
        return val;
      });

      let Data = {
        Header: Invoice.Data,
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
    let Invoice = await SeqFunc.getOne(req.dbconn.POP_ReturnMaster, {
      where: { TransNo: req.query.TransNo, Posted: false },
    });

    if (Invoice.success) {
      await SeqFunc.Delete(req.dbconn.POP_ReturnBatches, {
        where: { TransNo: Invoice.Data.TransNo },
      });

      await SeqFunc.Delete(req.dbconn.POP_ReturnTaxes, {
        where: { TransNo: Invoice.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.POP_ReturnDetail, {
        where: { TransNo: Invoice.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.POP_ReturnMaster, {
        where: { TransNo: Invoice.Data.TransNo },
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

    let InvoiceData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.POP_ReturnMaster,
      req.dbconn.POP_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (InvoiceData.success) {
      let LineSeq = 1;
      let TaxArray = []
      let BatchArray = []


      Detail.map((o) => {
        delete o.RID;
        o.TransNo = InvoiceData.Data.TransNo;
        o.RLineSeq = LineSeq;
        o.Taxes?.map((l) => {
          delete l.RID;
          l.TransNo = o.TransNo;
          l.ItemCode = o.ItemCode;
          l.Item = o.Item;
          l.RLineSeq = o.RLineSeq;
          l.TaxScheduleID = o.TaxScheduleID;
          l.TaxScheduleCode = o.TaxScheduleCode;
          l.TaxSchedule = o.TaxSchedule;
          TaxArray.push(l)
          return l;
        });

        o.Batches?.map((b) => {
          delete b.RID;
          b.TransNo = o.TransNo;
          b.RLineSeq = o.RLineSeq;
          BatchArray.push(b)
          return b;
        })

        LineSeq++;
        return o;
      });

      let DetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.POP_ReturnDetail,
        { where: { TransNo: InvoiceData.Data.TransNo }, transaction: t },
        Detail,
        t
      );

      if (DetailData.success) {
        let BatchesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.POP_ReturnBatches,
          { where: { TransNo: InvoiceData.Data.TransNo }, transaction: t },
          BatchArray,
          t
        );

        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.POP_ReturnTaxes,
          { where: { TransNo: InvoiceData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success && BatchesData.success) {
          await t.commit();
          await UpdateData.executeData(req);
          let Allocation = {};

          Allocation = await Stock.Allocation.Allocation(
            req.dbconn,
            req.dbconn.POP_ReturnDetail,
            InvoiceData.Data.TransNo,
            InvoiceData.Data.TransDate,
            InvoiceData.Data.TransType,
            InvoiceData.Data.LocationCode,
            Header.Posted);
          if (Allocation.Success === true) {

            if (Header.Posted) {
              req.body.Header['TransNo'] = InvoiceData.Data.TransNo
              Post.postData(req, res);
            } else {
              if (InvoiceData.created) {
                ResponseLog.Create200(req, res);
              } else {
                ResponseLog.Update200(req, res);
              }
            }

          } else {
            res.status(200).send({ Success: false, Message: Allocation.Message, data: Allocation.data })
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
