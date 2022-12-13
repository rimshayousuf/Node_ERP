const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostQuote");
const con = require("../../../AppConfig");
const UpdateData = require("../../../core/UpdateParallelData");

exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo","TransDate", "Customer" , "Location",["TotalR","Total"], "Description", "Status" , ["SubmittedBy", "Submitted By"]];
    
    let SQ = await SeqFunc.getAll(
      req.dbconn.SOP_QuoteMaster,
      {},
      true,
      Columns
    );
    if (SQ.success) {
      SQ.Data.rows.map((val) => {
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.TotalAmount)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.SubmittedBy = val.SubmitStatus ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";
        val.Status = val.SubmitStatus ? "Submitted" : "Pending";
        return val;
      });

      ResponseLog.Send200(req, res, SQ.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    console.log(err)
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let SQ = await SeqFunc.getOne(req.dbconn.SOP_QuoteMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (SQ.success) {
      let Detail = await req.dbconn.SOP_QuoteDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
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
        req.dbconn.SOP_QuoteTaxes,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "QLineSeq",
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
        val.Taxes = Taxes.Data.filter((o) => o.QLineSeq === val.QLineSeq && o.TransNo === val.TransNo);
        val.UOMArray = UOMData.filter((o) => o.ItemCode === val.ItemCode);
        return val;
      });

      let Data = {
        Header: SQ.Data,
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
    let SQ = await SeqFunc.getOne(req.dbconn.SOP_QuoteMaster, {
      where: { TransNo: req.query.TransNo, SubmitStatus: false },
    });

    if (SQ.success) {
      await SeqFunc.Delete(req.dbconn.SOP_QuoteTaxes, {
        where: { TransNo: SQ.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_QuoteDetail, {
        where: { TransNo: SQ.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_QuoteMaster, {
        where: { TransNo: SQ.Data.TransNo },
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
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.PostedUser = req.headers.username;

    let SQData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.SOP_QuoteMaster,
      req.dbconn.SOP_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (SQData.success) {
      let LineSeq = 1;
      let TaxArray = [];
      Detail.map((o) => {
        delete o.RID;
        o.TransNo = SQData.Data.TransNo;
        o.QLineSeq = LineSeq;
        o.Taxes?.map((l) => {
          delete l.RID;
          l.TransNo = o.TransNo;
          l.ItemCode = o.ItemCode;
          l.Item = o.Item;
          l.QLineSeq = o.QLineSeq;
          TaxArray.push(l)
          return l;
        });
        LineSeq++;
        return o;
      });

      let DetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.SOP_QuoteDetail,
        { where: { TransNo: SQData.Data.TransNo }, transaction: t },
        Detail,
        t
      );

      if (DetailData.success) {
        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.SOP_QuoteTaxes,
          { where: { TransNo: SQData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success) {
          await t.commit();
          await UpdateData.executeData(req);

          if (Header.SubmitStatus) {
            req.body.Header['TransNo'] = SQData.Data.TransNo
            Post.postData(req, res);
          } else {
            if (SQData.created) {
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
