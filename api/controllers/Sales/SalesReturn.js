const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostReturn");

const con = require("../../../AppConfig");
const UpdateData = require("../../../core/UpdateParallelData");

exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo","TransDate", "Customer" , "Location",["TotalR","Total"], ["Remarks", "Description"], ["RPosted", "Status"] , ["PostedBy", "Posted By"]];

    let INV = await SeqFunc.getAll(
      req.dbconn.SOP_ReturnMaster,
      {},
      true,
      Columns
    );
    if (INV.success) {
      INV.Data.rows.map((val) => {
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.TransTotal)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.PostedBy = val.Posted ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";
        
        val.RPosted = val.Posted ? "Posted" : "Un-Posted";
        return val;
      });

      ResponseLog.Send200(req, res, INV.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let INV = await SeqFunc.getOne(req.dbconn.SOP_ReturnMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (INV.success) {
      let Detail = await req.dbconn.SOP_ReturnDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "RLineSeq",
          "DTransNo",
          "DLineSeq",
          "ItemCode",
          "Item",
          "ItemTrackBy",
          "ItemType",
          "UOMCode",
          "UOM",
          "JobCode",
          "Job",
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
        req.dbconn.SOP_ReturnTaxes,
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

      // let Batches = await SeqFunc.getAll(
      //   req.dbconn.SOP_ReturnBatches,
      //   { where: { TransNo: req.query.TransNo } },
      //   false,
      //   [
      //     "TransNo",
      //     "RLineSeq",
      //     "ItemCode",
      //     "Item",
      //     "TaxScheduleID",
      //     "TaxScheduleCode",
      //     "TaxSchedule",
      //     "TaxDetailID",
      //     "TaxDetailCode",
      //     "TaxDetail",
      //     "TaxRate",
      //     "TaxAmount",
      //     "TaxAmount_Cur",
      //   ]
      // );

      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail) 

      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })


      Detail.map((val) => {
        val.Taxes = Taxes.Data.filter((o) => o.RLineSeq === val.RLineSeq && o.TransNo == val.TransNo);
        val.UOMArray = UOMData.filter((o) => o.ItemCode === val.ItemCode);

        val.Batches = []
        return val;
      });

      let Data = {
        Header: INV.Data,
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
    let INV = await SeqFunc.getOne(req.dbconn.SOP_ReturnMaster, {
      where: { TransNo: req.query.TransNo, Posted: false },
    });

    if (INV.success) {
      await SeqFunc.Delete(req.dbconn.SOP_ReturnTaxes, {
        where: { TransNo: INV.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_ReturnDetail, {
        where: { TransNo: INV.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_ReturnMaster, {
        where: { TransNo: INV.Data.TransNo },
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

    let INVData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.SOP_ReturnMaster,
      req.dbconn.SOP_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (INVData.success) {
      let LineSeq = 1;
      let TaxArray = [];
      Detail.map((o) => {
        o.TransNo = INVData.Data.TransNo;
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
        LineSeq++;
        return o;
      });

      let DetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.SOP_ReturnDetail,
        { where: { TransNo: INVData.Data.TransNo }, transaction: t },
        Detail,
        t
      );

      if (DetailData.success) {
        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.SOP_ReturnTaxes,
          { where: { TransNo: INVData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success) {
          await t.commit();
          if (Header.Posted) {
            req.body.Header['TransNo'] = INVData.Data.TransNo
            Post.postData(req, res);
          } else {
            if (INVData.created) {
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
