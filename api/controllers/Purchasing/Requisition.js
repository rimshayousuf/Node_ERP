const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostRequisition");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const con = require("../../../AppConfig")
const UpdateData = require("../../../core/UpdateParallelData");

exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo", "TransDate", "Vendor","Location", ["TotalR", "Total"], "Description", ["StatusDesc","Status"], ["SubmittedBy", "Submitted By"]];
    let REQ = await SeqFunc.getAll(
      req.dbconn.POP_RequisitionMaster,
      { order: [["createdAt", "DESC"]] },
      true,
      Columns
    );
    if (REQ.success) {
      REQ?.Data?.rows?.map(v => {
        v.TransDate = con.MomentformatDate(v.TransDate)
        v.TotalR = con.currencyFormat(v.TotalAmount)
        v.StatusDesc = v.Status ? 'Submitted' : 'Pending'
        v.CreatedBy = v.CreatedUser + ' ' + con.MomentformatDateTime(v.createdAt);
        v.SubmittedBy = v.Status ? v.PostedUser + ' ' + con.MomentformatDateTime(v.postedAt) : "";
        return v;
      })

      ResponseLog.Send200(req, res, REQ.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let REQ = await SeqFunc.getOne(
      req.dbconn.POP_RequisitionMaster,
      {
        where: { TransNo: req.query.TransNo },
      }
    );
    if (REQ.success) {
      let Detail = await req.dbconn.POP_RequisitionDetail.findAll({
        attributes: [
          "TransNo",
          "RLineSeq",
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
          "SubTotal",
          "SubTotal_Cur",
          "TaxScheduleCode",
          "TaxSchedule",
          "TaxAmount",
          "TotalAmount",
          "TaxAmount_Cur",
          "TotalAmount_Cur",
          "LineDescription",
        ],
        where: { TransNo: REQ.Data.TransNo }
      })

      let Taxes = await SeqFunc.getAll(
        req.dbconn.POP_RequisitionTaxes,
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
  
      await Promise.all(
        Detail.map(async val => {
          val.Taxes = Taxes.Data.filter((o) => Number(o.RLineSeq) === Number(val.RLineSeq));
          val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)
  
          return val;
        })
      )

      let Data = {
        Header: REQ.Data,
        Detail: Detail,
      };

      ResponseLog.Send200(req, res, Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    console.log(err)
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let REQ = await SeqFunc.getOne(
      req.dbconn.POP_RequisitionMaster,
      {
        where: { TransNo: req.query.TransNo, SubmitStatus: false },
      }
    );

    if (REQ.success) {
      await SeqFunc.Delete(req.dbconn.POP_RequisitionDetail, {
        where: { TransNo: REQ.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.POP_RequisitionMaster, {
        where: { TransNo: REQ.Data.TransNo },
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

    Header.StatusDesc = Header.Status ? "Submitted" : "Pending";

    let REQData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.POP_RequisitionMaster,
      req.dbconn.POP_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (REQData.success) {
      let i = 1;
      let TaxArray = []
      Detail = Detail.filter(v => v.ItemCode !== '')
      Detail.map((o) => {
        delete o.RID
        delete o.createdAt
        delete o.updatedAt
        o.TransNo = REQData.Data.TransNo;
        o.RLineSeq = i;
        o.Taxes?.map((l) => {
          delete l.RID;
          l.TransNo = o.TransNo;
          l.ItemCode = o.ItemCode;
          l.Item = o.Item;
          l.TaxScheduleID = o.TaxScheduleID;
          l.TaxScheduleCode = o.TaxScheduleCode;
          l.TaxSchedule = o.TaxSchedule;
          l.RLineSeq = o.RLineSeq;
          TaxArray.push(l)
          return l;
        });
        
        i++;
        return o;
      });

      let REQDetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.POP_RequisitionDetail,
        { where: { TransNo: REQData.Data.TransNo }, transaction: t },
        Detail,
        t
      );
      if (REQDetailData.success) {
        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.POP_RequisitionTaxes,
          { where: { TransNo: REQData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success) {
        await t.commit();
        await UpdateData.executeData(req);
        if (Header.SubmitStatus) {
          req.body.Header['TransNo'] = REQData.Data.TransNo
          Post.postData(req, res);
        } else {
          if (REQData.created) {
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