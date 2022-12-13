const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");
const Post = require("./PostDispatch");

const con = require("../../../AppConfig");
const UpdateData = require("../../../core/UpdateParallelData");

exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo","TransDate", "Customer" , "Location","Description", ["RPosted", "Status"] , ["PostedBy", "Posted By"]];

    let SO = await SeqFunc.getAll(
      req.dbconn.SOP_DispatchMaster,
      {},
      true,
      Columns
    );
    if (SO.success) {
      SO.Data.rows.map((val) => {
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.TotalR = con.currencyFormat(val.TransTotal)

        val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
        val.PostedBy = val.Posted ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";
        
        val.RPosted = val.Posted ? "Posted" : "Un-Posted";
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
    let SO = await SeqFunc.getOne(req.dbconn.SOP_DispatchMaster, {
      where: { TransNo: req.query.TransNo },
    });

    if (SO.success) {
      let Detail = await req.dbconn.SOP_DispatchDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "OLineSeq",
          "OTransNo",
          "DLineSeq",
          "ItemCode",
          "Item",
          "ItemTrackBy",
          "ItemType",
          "UOMCode",
          "TaxScheduleID",
          "TaxScheduleCode",
          "TaxSchedule",
          "UOM",
          "JobCode",
          ["Job", "JobDesc"],
          "UnitQuantity",
          "Quantity",
          "BaseQuantity",
          [req.dbconn.Sequelize.literal(`dbo.GetInventoryStock(ItemCode,'${SO.Data.LocationCode}') + BaseQuantity`), 'QtyBal'],
          "Price",
          "Amount",
          "Amount_Cur",
          "TaxAmount",
          "TaxAmount_Cur",
          "NetAmount",
          "NetAmount_Cur",
          "Remarks",
        ],
      });

      let Taxes = await SeqFunc.getAll(
        req.dbconn.SOP_DispatchTaxes,
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

      // let Batches = await SeqFunc.getAll(
      //   req.dbconn.SOP_DispatchBatches,
      //   { where: { TransNo: req.query.TransNo } },
      //   false,
      //   [
      //     "TransNo",
      //     "OLineSeq",
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


      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })


      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail)

      Detail.map((val) => {
        val.Taxes = Taxes.Data.filter((o) => o.QLineSeq === val.QLineSeq && o.TransNo === val.TransNo);
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
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let SO = await SeqFunc.getOne(req.dbconn.SOP_DispatchMaster, {
      where: { TransNo: req.query.TransNo, Posted: false },
    });

    if (SO.success) {
      await SeqFunc.Delete(req.dbconn.SOP_DispatchTaxes, {
        where: { TransNo: SO.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_DispatchDetail, {
        where: { TransNo: SO.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.SOP_DispatchMaster, {
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

    let SOData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.SOP_DispatchMaster,
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
        o.TransNo = SOData.Data.TransNo;
        o.DLineSeq = LineSeq;
        o.Taxes?.map((l) => {
          delete l.RID;
          l.TransNo = o.TransNo;
          l.ItemCode = o.ItemCode;
          l.Item = o.Item;
          l.DLineSeq = o.DLineSeq;
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
        req.dbconn.SOP_DispatchDetail,
        { where: { TransNo: SOData.Data.TransNo }, transaction: t },
        Detail,
        t
      );

      if (DetailData.success) {
        let TaxesData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.SOP_DispatchTaxes,
          { where: { TransNo: SOData.Data.TransNo }, transaction: t },
          TaxArray,
          t
        );
        if (TaxesData.success) {
          await t.commit();
          await UpdateData.executeData(req);

          let Allocation = {};
          Allocation = await Stock.Allocation.Allocation(
            req.dbconn,
            req.dbconn.SOP_DispatchDetail,
            SOData.Data.TransNo,
            SOData.Data.TransDate,
            SOData.Data.TransType,
            SOData.Data.LocationCode,
            Header.Posted);

          if (Allocation.Success === true) {
            if (Header.Posted) {
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
    console.log(err)
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
