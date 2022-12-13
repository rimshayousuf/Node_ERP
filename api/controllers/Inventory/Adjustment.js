const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");
const Post = require("./PostAdjustment");
const con = require("../../../AppConfig")


exports.getList = async (req, res) => {
  try {
    let Columns = [
      "TransNo",
      "TransDate",
      ["RFormType", "Trans Type"],
      "Location",
      "Remarks",
      ["RPosted", "Status"],
      ["PostedBy", "Posted By"]
    ];
    let ADJ = await SeqFunc.getAll(
      req.dbconn.INV_TransactionHeader,
      {},
      true,
      Columns
    );
    if (ADJ.success) {

      // { code: 'AdjInward', value: 'Inward Adjustment' },
      // { code: 'Adjustment', value: 'Outward Adjustment' },
      // { code: 'Consumption', value: 'Consumption' },
      // { code: 'Damage', value: 'Damage' },
      // { code: 'Expiry', value: 'Expiry' }

      ADJ.Data.rows.map((val) => {
        val.RPosted = val.Posted ? "Posted" : "Un-Posted";
        val.RFormType = val.FormType === 'AdjInward' ? "Inward" : val.FormType === 'Adjustment' ? "Outward" : val.FormType;
        val.TransDate = con.MomentformatDate(val.TransDate)
        val.PostedBy = val.Posted ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";
        return val;
      });

      ResponseLog.Send200(req, res, ADJ.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let ADJ = await SeqFunc.getOne(
      req.dbconn.INV_TransactionHeader,
      {
        where: { TransNo: req.query.TransNo },
      }
    );

    if (ADJ.success) {

      let Detail = await req.dbconn.INV_TransactionDetail.findAll({
        where: { TransNo: req.query.TransNo },
        attributes: [
          "TransNo",
          "TLineSeq",
          "ItemCode",
          "UOMCode",
          "UOM",
          "UnitQuantity",
          "Item",
          "ItemTrackBy",
          "ItemType",
          "Quantity",
          "BaseQuantity",
          [req.dbconn.Sequelize.literal(`dbo.GetInventoryStock(ItemCode,'${ADJ.Data.LocationCode}') + BaseQuantity`), 'QtyBal'],
          "UnitCost",
          "Amount",
          "Remarks",
        ]
      })

      let Batches = await SeqFunc.getAll(
        req.dbconn.INV_TransactionBatches,
        { where: { TransNo: req.query.TransNo } },
        false,
        [
          "TransNo",
          "TLineSeq",
          "BatchNo",
          "ExpiryDate",
          "Quantity",
          "BaseQuantity",
          ["BaseQuantity", "CurrBaseQuantity"],
          ["Quantity", "CurrQuantity"],
        ]
      );

      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail)

      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })


      Detail.map((val) => {
        val.Batches = Batches.Data.filter((o) => o.TLineSeq === val.TLineSeq && o.TransNo === val.TransNo);
        val.UOMArray = UOMData.filter((o) => o.ItemCode === val.ItemCode);

        return val;
      });

      let Data = {
        Header: ADJ.Data,
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
    let ADJ = await SeqFunc.getOne(
      req.dbconn.INV_TransactionHeader,
      {
        where: { TransNo: req.query.TransNo, Posted: false },
      }
    );

    if (ADJ.success) {
      await SeqFunc.Delete(req.dbconn.INV_TransactionBatches, {
        where: { TRID: ADJ.Data.TRID },
      });
      await SeqFunc.Delete(req.dbconn.INV_TransactionDetail, {
        where: { TRID: ADJ.Data.TRID },
      });
      await SeqFunc.Delete(req.dbconn.INV_TransactionHeader, {
        where: { TRID: ADJ.Data.TRID },
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
    delete Header.TRHID
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.PostedUser = req.headers.username;

    let ADJData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.INV_TransactionHeader,
      req.dbconn.INV_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (ADJData.success) {
      let BatchArray = [];
      let LineSeq = 1
      Detail.map((o) => {
        o.TRID = ADJData.Data.TRID;
        o.TransNo = ADJData.Data.TransNo
        o.TLineSeq = LineSeq
        if (o.ItemTrackBy !== "None") {
          o.Batches.map((BData) => {
            let Bquery = {
              TransNo: ADJData.Data.TransNo,
              BatchNo: BData.BatchNo,
              ExpiryDate: o.ItemTrackBy === "Batch" ? null : BData.ExpiryDate,
              Quantity: BData.Quantity,
              UnitQuantity: BData.UnitQuantity,
              TLineSeq: o.TLineSeq,
            };
            BatchArray.push(Bquery);
          });
        }
        LineSeq++
        return o;
      });

      let ADJDetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.INV_TransactionDetail,
        { where: { TRID: ADJData.Data.TRID }, transaction: t },
        Detail,
        t
      );
      if (ADJDetailData.success) {
        let ADJBatchData = await SeqFunc.Trans_bulkCreate(
          req.dbconn.INV_TransactionBatches,
          { where: { TransNo: ADJData.Data.TransNo }, transaction: t },
          BatchArray,
          t
        );
        if (ADJBatchData.success) {
          await t.commit();
          let Allocation = {};
          if (Header.FormType !== "AdjInward") {
            Allocation = await Stock.Allocation.Allocation(
              req.dbconn,
              req.dbconn.INV_TransactionDetail,
              ADJData.Data.TransNo,
              ADJData.Data.TransDate,
              ADJData.Data.TransType,
              ADJData.Data.LocationCode,
              Header.Posted);

              let UpdateQuery = `UPDATE TD SET UnitCost = SA.UnitCost 
              FROM INV_TransactionDetail TD
              INNER JOIN (SELECT TransNo, [LineNo], UnitCost=AVG(UnitCost) FROM INV_StockAlloc GROUP BY TransNo, [LineNo]) SA ON SA.TransNo = TD.TransNo AND SA.[LineNo] = TD.TLineSeq
              WHERE TD.TransNo = :TransNo`;
    
            await req.dbconn.sequelize.query(UpdateQuery, { replacements: { TransNo: ADJData.Data.TransNo }, type: req.dbconn.Sequelize.QueryTypes.SELECT })
    
          } else {
            Allocation.Success = true;
          }
          if (Allocation.Success === true) {
            if (Header.Posted) {
              req.body.Header['TransNo'] = ADJData.Data.TransNo
              Post.postData(req, res);
            } else {
              if (ADJData.created) {
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
          console.log(err)

          ResponseLog.Error200(req, res, "Error Saving Record!");
        }
      } else {
        t.rollback();
        console.log(err)

        ResponseLog.Error200(req, res, "Error Saving Record!");
      }
    } else {
      t.rollback();
      console.log(err)

      ResponseLog.Error200(req, res, "Error Saving Record!");
    }
  } catch (err) {
    t.rollback();
    console.log(err)
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
