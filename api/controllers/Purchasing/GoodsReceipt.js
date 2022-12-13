const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostGoodsReceipt");
const con = require("../../../AppConfig");
const UpdateData = require("../../../core/UpdateParallelData");



exports.getList = async (req, res) => {
  try {

    let Columns = ["TransNo", "TransDate", "Vendor", "Location", ["TotalR", "Total"], "Description", ["RPosted", "Status"], ["PostedBy", "Posted By"]];

    let GR = await SeqFunc.getAll(
      req.dbconn.POP_GoodsReceiptMaster,
      { order: [["createdAt", "DESC"]] },
      true,
      Columns
    );
    if (GR.success) {
      GR.Data.rows.map((val) => {
        val.RPosted = val.Posted ? "Posted" : "Un-Posted";
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.TotalAmount)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.PostedBy = val.Posted ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

        return val;
      });

      ResponseLog.Send200(req, res, GR.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let GR = await SeqFunc.getOne(req.dbconn.POP_GoodsReceiptMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (GR.success) {
      let Detail = await req.dbconn.POP_GoodsReceiptDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "GLineSeq",
          "OTransNo",
          "OLineSeq",
          "ItemCode",
          "Item",
          "ItemTrackBy",
          "ItemType",
          "TaxScheduleID",
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
        req.dbconn.POP_GoodsReceiptTaxes,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "GLineSeq",
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
        req.dbconn.POP_GoodsReceiptBatches,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "GLineSeq",
          "BatchNo",
          "ExpiryDate",
          "Quantity",
          "BaseQuantity"
        ]
      );

      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })


      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail)

      Detail.map((val) => {
        val.Taxes = Taxes.Data.filter((o) => o.GLineSeq === val.GLineSeq);
        val.Batches = Batches.Data.filter((o) => o.GLineSeq === val.GLineSeq);
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)
        return val;
      });

      let ExpDtl = undefined
      let ExpHdr = await SeqFunc.getOne(req.dbconn.FIN_LCExpenseHeader, {
        where: { TransNo: req.query.TransNo },
      });
      
      if (ExpHdr.success) {
        ExpDtl = await req.dbconn.FIN_LCExpenseDetail.findAll({
          where: { HID: ExpHdr.Data.RID }
        })
      }

        let Data = {
          Header: GR.Data,
          Detail: Detail,
          LCExpense: { Header: ExpHdr?.Data, Detail: ExpDtl }
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
      let GR = await SeqFunc.getOne(req.dbconn.POP_GoodsReceiptMaster, {
        where: { TransNo: req.query.TransNo, Posted: false },
      });

      if (GR.success) {
        await SeqFunc.Delete(req.dbconn.POP_GoodsReceiptBatches, {
          where: { TransNo: GR.Data.TransNo },
        });

        await SeqFunc.Delete(req.dbconn.POP_GoodsReceiptTaxes, {
          where: { TransNo: GR.Data.TransNo },
        });
        await SeqFunc.Delete(req.dbconn.POP_GoodsReceiptDetail, {
          where: { TransNo: GR.Data.TransNo },
        });
        await SeqFunc.Delete(req.dbconn.POP_GoodsReceiptMaster, {
          where: { TransNo: GR.Data.TransNo },
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
      let LCExpense = req.body.LCExpense;

      delete Header.RID;
      Header.CreatedUser = req.headers.username;
      Header.ModifyUser = req.headers.username;
      Header.PostedUser = req.headers.username;

      let GRData = await SeqFunc.Trans_updateOrCreate(
        req.dbconn,
        req.dbconn.POP_GoodsReceiptMaster,
        req.dbconn.POP_NextNo,
        {
          where: { TransNo: Header.TransNo ? Header.TransNo : "" },
          transaction: t,
        },
        Header,
        t
      );

      if (GRData.success) {
        let LineSeq = 1;
        let TaxArray = []
        let BatchArray = []

        Detail = Detail.filter(v => v.ItemCode !== '')
        Detail.map((o) => {
          delete o.RID;
          o.TransNo = GRData.Data.TransNo;
          o.GLineSeq = LineSeq;
          o.Taxes?.map((l) => {
            delete l.RID;
            l.TransNo = o.TransNo;
            l.ItemCode = o.ItemCode;
            l.Item = o.Item;
            l.GLineSeq = o.GLineSeq;
            l.TaxScheduleID = o.TaxScheduleID;
            l.TaxScheduleCode = o.TaxScheduleCode;
            l.TaxSchedule = o.TaxSchedule;
            TaxArray.push(l)
            return l;
          });

          o.Batches?.map((b) => {
            delete b.RID;
            b.TransNo = o.TransNo;
            b.GLineSeq = o.GLineSeq;
            BatchArray.push(b)
            return b;
          })

          LineSeq++;
          return o;
        });

        let DetailData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.POP_GoodsReceiptDetail,
          { where: { TransNo: GRData.Data.TransNo }, transaction: t },
          Detail,
          t
        );

        if (DetailData.success) {
          let BatchesData = await SeqFunc.Trans_bulkCreate(
            req.dbconn.POP_GoodsReceiptBatches,
            { where: { TransNo: GRData.Data.TransNo }, transaction: t },
            BatchArray,
            t
          );

          let TaxesData = await SeqFunc.Trans_bulkCreate(
            req.dbconn.POP_GoodsReceiptTaxes,
            { where: { TransNo: GRData.Data.TransNo }, transaction: t },
            TaxArray,
            t
          );
          if (TaxesData.success && BatchesData.success) {

          //   if (Header.LCAmount > 0 && LCExpense) {
          //     let ExpHeader = LCExpense.Header;
          //     let ExpDetail = LCExpense.Detail;

          //     const ExpH1 = await req.dbconn.FIN_LCExpenseHeader.findOne({ where: { TransNo: GRData.Data.TransNo }, transaction: t })

          //     if (ExpH1) {
          //       await req.dbconn.FIN_LCExpenseDetail.destroy({ where: { HID: ExpH1.RID }, transaction: t })
          //       await req.dbconn.FIN_LCExpenseHeader.destroy({ where: { RID: ExpH1.RID }, transaction: t })
          //     }


          //     const ExpH = await req.dbconn.FIN_LCExpenseHeader.create({
          //       LCCode: ExpHeader.LCCode,
          //       LCDesc: ExpHeader.LCDesc,
          //       TransType: 'GRN',
          //       TransNo: GRData.Data.TransNo,
          //       CreatedUser: req.headers.userid
          //     }, { transaction: t })

          //     ExpDetail.map((d) => {
          //       d.HID = ExpH.RID
          //       return d;
          //     })

          //     await req.dbconn.FIN_LCExpenseDetail.bulkCreate(ExpDetail, { transaction: t })
          //   }


          await t.commit();
            await UpdateData.executeData(req);

            if (Header.Posted) {
              req.body.Header['TransNo'] = GRData.Data.TransNo
              Post.postData(req, res);
            } else {
              if (GRData.created) {
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
