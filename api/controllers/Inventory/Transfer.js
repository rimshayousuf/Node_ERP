const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");
const Post = require("./PostTransfer");
const con = require("../../../AppConfig");
const { Op } = require("sequelize");
const UpdateData = require("../../../core/UpdateParallelData");

exports.getList = async (req, res) => {
  try {
    let Columns = [
      "TransNo",
      "TransDate",
      ["RTransType", "Trans Type"],
      "Location",
      "Remarks",
      ["RPosted", "Status"],
      ["PostedBy", "Posted By"]
    ];
    let ADJ = await SeqFunc.getAll(
      req.dbconn.INV_TransferHeader,
      { where: { TransType: { [Op.in]: ["XFR", "IXFR"] } } },
      true,
      Columns
    );
    if (ADJ.success) {
      ADJ.Data.rows.map((val) => {
        val.RPosted = val.Posted ? "Posted" : "Un-Posted";
        val.RTransType = val.TransType === 'XFR' ? "Direct" : "In-Transit";
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
    let ADJ = await SeqFunc.getOne(req.dbconn.INV_TransferHeader, {
      where: { TransNo: req.query.TransNo },
    });

    if (ADJ.success) {
      let Detail = await req.dbconn.INV_TransferDetail.findAll(
        {
          where: { TransNo: ADJ.Data.TransNo },
          attributes: [
            "RTransNo",
            "TransNo",
            "TLineSeq",
            "ItemCode",
            "Item",
            "ItemTrackBy",
            "ItemType",
            "UOMCode",
            "UOM",
            "UnitQuantity",
            "BaseQuantity",
            "Quantity",
            [
              req.dbconn.Sequelize.literal(
                `dbo.GetInventoryStock(ItemCode,'${ADJ.Data.LocationCode}') + BaseQuantity`
              ),
              "QtyBal",
            ],
            "UnitCost",
            "Remarks",
          ]
        });

      let Batches = await SeqFunc.getAll(
        req.dbconn.INV_TransferBatches,
        { where: { TransNo: ADJ.Data.TransNo } },
        false,
        [
          "TransNo",
          "TLineSeq",
          "BatchNo",
          "ExpiryDate",
          "Quantity",
          "BaseQuantity",
          ["Quantity", "CurrQuantity"],
          ["BaseQuantity", "CurrBaseQuantity"],
        ]
      );

      let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

      let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })

      Detail = JSON.stringify(Detail)
      Detail = JSON.parse(Detail)

      Detail.map((val) => {
        val.Batches = Batches.Data.filter((o) => o.TLineSeq === val.TLineSeq);
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
    let ADJ = await SeqFunc.getOne(req.dbconn.INV_TransferHeader, {
      where: { TransNo: req.query.TransNo, Posted: false },
    });

    if (ADJ.success) {
      await SeqFunc.Delete(req.dbconn.INV_TransferBatches, {
        where: { TransNo: ADJ.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.INV_TransferDetail, {
        where: { TransNo: ADJ.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.INV_TransferHeader, {
        where: { TransNo: ADJ.Data.TransNo },
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
      req.dbconn.INV_TransferHeader,
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
        delete o.TRDID
        o.TransNo = ADJData.Data.TransNo
        o.TLineSeq = LineSeq
        if (o.ItemTrackBy !== "None") {
          o.Batches?.map((BData) => {
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
        req.dbconn.INV_TransferDetail,
        { where: { TransNo: ADJData.Data.TransNo }, transaction: t },
        Detail,
        t
      );
      if (ADJDetailData.success) {
        // let ADJBatchData = await SeqFunc.Trans_bulkCreate(
        //   req.dbconn.INV_TransferBatches,
        //   { where: { TransNo: ADJData.Data.TransNo }, transaction: t },
        //   BatchArray,
        //   t
        // );
        // if (ADJBatchData.success) {
        await t.commit();
        await UpdateData.executeData(req);

        let Allocation = {};
        Allocation = await Stock.Allocation.Allocation(
          req.dbconn,
          req.dbconn.INV_TransferDetail,
          ADJData.Data.TransNo,
          ADJData.Data.TransDate,
          ADJData.Data.TransType,
          ADJData.Data.LocationCode,
          Header.Posted);

        let UpdateQuery = `UPDATE TD SET UnitCost = SA.UnitCost 
          FROM INV_TransferDetail TD
          INNER JOIN (SELECT TransNo, [LineNo], UnitCost=AVG(UnitCost) FROM INV_StockAlloc GROUP BY TransNo, [LineNo]) SA ON SA.TransNo = TD.TransNo AND SA.[LineNo] = TD.TLineSeq
          WHERE TD.TransNo = :TransNo`;

        await req.dbconn.sequelize.query(UpdateQuery, { replacements: { TransNo: ADJData.Data.TransNo }, type: req.dbconn.Sequelize.QueryTypes.SELECT })


        if (Allocation.Success === true) {
          if (Header.Posted) {
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
        // } else {
        //   t.rollback();
        //   ResponseLog.Error200(req, res, "Error Saving Record!");
        // }
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
