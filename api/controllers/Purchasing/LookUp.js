const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const MaterialData = require("../../../core/MaterialData");
const _ = require('lodash');

exports.OpenRequisitions = async (req, res) => {
  try {

    let sqlQuery = `SELECT RTransNo=H.TransNo, RLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, I.TaxScheduleID, I.TaxScheduleCode, I.TaxSchedule, D.UOMCode, D.UOM, D.UnitQuantity, 
                      Quantity = BaseQuantity - (ISNULL(UsedQuantity,0) + ISNULL(CanceledQuantity,0)),
                      BaseQuantity = BaseQuantity,
                      AvailableQuantity = BaseQuantity - (ISNULL(UsedQuantity,0) + ISNULL(CanceledQuantity,0)),
                      Price=D.Price,
                      SubTotal=D.SubTotal,
                      TaxAmount=D.TaxAmount
                      FROM POP_RequisitionMaster H
                      INNER JOIN  POP_RequisitionDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                      INNER JOIN INV_Item I ON I.ItemCode = D.ItemCode
                      WHERE H.Status = 1 AND H.LocationCode = :LocationCode AND H.VendorCode = :VendorCode
                      AND BaseQuantity - (ISNULL(UsedQuantity,0) + ISNULL(CanceledQuantity,0)) > 0
                      ORDER BY RTransNo, RLineSeq`;

    let OpenPRs = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode, VendorCode: req.query.VendorCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let TaxColumns = [
      "TaxScheduleID",
      "TaxScheduleCode",
      "TaxSchedule",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxType",
      "AcctCode",
      "AcctDesc",
      "TaxRate",
      [req.dbconn.sequelize.literal('0'), "TaxAmount"],
      [req.dbconn.sequelize.literal('0'), "TaxAmount_Cur"]
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.FIN_TaxScheduleDetail.findAll({ attributes: TaxColumns })

    OpenPRs = JSON.stringify(OpenPRs)
    OpenPRs = JSON.parse(OpenPRs)

    await Promise.all(
      OpenPRs.map(async val => {
        let TaxesD = TaxesData.filter(v => v.TaxScheduleCode === val.TaxScheduleCode)
        let TaxesArray = []
        let TaxAmount = 0

        TaxesD.map(t => {
          TaxAmount += (val.Amount * t.TaxRate) / 100
          let Item = {
            TaxScheduleCode: t.TaxScheduleCode,
            TaxSchedule: t.TaxSchedule,
            TaxDetailID: t.TaxDetailID,
            TaxDetailCode: t.TaxDetailCode,
            TaxDetail: t.TaxDetail,
            TaxRate: t.TaxRate,
            TaxAmount: (val.Amount * t.TaxRate) / 100,
            TaxAmount_Cur: (val.Amount * t.TaxRate) / 100
          }
          TaxesArray.push(Item)
        })
        val.TaxAmount = TaxAmount
        val.TaxAmount_Cur = TaxAmount
        val.NetAmount = TaxAmount + val.Amount
        val.NetAmount_Cur = TaxAmount + val.Amount

        val.Taxes = TaxesArray;
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )

    const grouped = _.groupBy(OpenPRs, pr => pr.RTransNo);
    let Data = []
    Object.keys(grouped).forEach(function (key, index) {
      Data.push({
        TransNo: key,
        ItemData: grouped[key]
      })
    });


    // let columns = [["RTransNo", "Trans No"], "ItemCode", "Item","ItemType","ItemTrackBy", "UOM", "Quantity", "AvailableQuantity"]
    // let Data = await MaterialData.LookUp(OpenPRs, columns);

    ResponseLog.Send200(req, res, {
      OpenPRs: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.OpenOrders = async (req, res) => {
  try {

    let sqlQuery = `SELECT OTransNo=H.TransNo, OLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, D.TaxScheduleCode, D.TaxSchedule, UOMCode, UOM, UnitQuantity, 
                    Quantity = BaseQuantity - (UsedQuantity + ISNULL(CanceledQuantity,0)),
                    BaseQuantity = BaseQuantity,
                    AvailableQuantity = BaseQuantity - (UsedQuantity + ISNULL(CanceledQuantity,0)),
                    Price=D.Price,
                    Amount=D.SubTotal,
                    Amount_Cur=D.SubTotal_Cur,
                    TaxAmount=D.TaxAmount,
                    TaxAmount_Cur=D.TaxAmount_Cur,
                    TotalAmount=D.TotalAmount,
                    TotalAmount_Cur=D.TotalAmount_Cur
                    FROM POP_OrderMaster H
                    INNER JOIN  POP_OrderDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                    WHERE H.Status = 1 AND H.LocationCode = :LocationCode AND H.VendorCode = :VendorCode
                    ORDER BY OTransNo, OLineSeq`;

    let OpenPOs = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode, VendorCode: req.query.VendorCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let TaxColumns = [
      "TaxScheduleID",
      "TaxScheduleCode",
      "TaxSchedule",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxType",
      "AcctCode",
      "AcctDesc",
      "TaxRate",
      [req.dbconn.sequelize.literal('0'), "TaxAmount"],
      [req.dbconn.sequelize.literal('0'), "TaxAmount_Cur"]
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.FIN_TaxScheduleDetail.findAll({ attributes: TaxColumns })

    OpenPOs = JSON.stringify(OpenPOs)
    OpenPOs = JSON.parse(OpenPOs)

    await Promise.all(
      OpenPOs.map(async val => {
        let TaxesD = TaxesData.filter(v => v.TaxScheduleCode === val.TaxScheduleCode)
        let TaxesArray = []
        let TaxAmount = 0

        TaxesD.map(t => {
          TaxAmount += (val.Amount * t.TaxRate) / 100
          let Item = {
            TaxScheduleCode: t.TaxScheduleCode,
            TaxSchedule: t.TaxSchedule,
            TaxDetailID: t.TaxDetailID,
            TaxDetailCode: t.TaxDetailCode,
            TaxDetail: t.TaxDetail,
            TaxRate: t.TaxRate,
            TaxAmount: (val.Amount * t.TaxRate) / 100,
            TaxAmount_Cur: (val.Amount * t.TaxRate) / 100
          }
          TaxesArray.push(Item)
        })
        val.TaxAmount = TaxAmount
        val.TaxAmount_Cur = TaxAmount
        val.NetAmount = TaxAmount + val.Amount
        val.NetAmount_Cur = TaxAmount + val.Amount

        val.Taxes = TaxesArray;
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )

    const grouped = _.groupBy(OpenPOs, pr => pr.OTransNo);
    let Data = []
    Object.keys(grouped).forEach(function (key, index) {
      Data.push({
        TransNo: key,
        ItemData: grouped[key]
      })
    });

    // let columns = [["OTransNo", "TransNo"], "ItemCode", "Item", "UOM", "Quantity", "AvailableQuantity"]
    // let Data = await MaterialData.LookUp(OpenPOs, columns);

    ResponseLog.Send200(req, res, {
      OpenPOs: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.OpenGoodsReceipt = async (req, res) => {
  try {

    let sqlQuery = `SELECT GTransNo=H.TransNo, GLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, TaxScheduleCode, 
                    TaxSchedule, UOMCode, UOM, UnitQuantity,
                    Quantity = D.Quantity,
                    BaseQuantity = BaseQuantity,
                    AvailableQuantity = BaseQuantity,
                    GRPrice=D.Price,
                    Price=D.Price,
                    SubTotal=D.SubTotal,
                    SubTotal_Cur=D.SubTotal_Cur,
                    TaxAmount=D.TaxAmount,
                    TaxAmount_Cur=D.TaxAmount_Cur,
                    TotalAmount=D.TotalAmount,
                    TotalAmount_Cur=D.TotalAmount_Cur
                    FROM POP_GoodsReceiptMaster H
                    INNER JOIN  POP_GoodsReceiptDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                    INNER JOIN INV_StockMaster S ON S.TransNo = H.TransNo AND S.[LineNo] = D.GLineSeq AND S.[Status] = 0
                    WHERE H.Posted = 1 AND H.LocationCode = :LocationCode AND H.VendorCode = :VendorCode
                    ORDER BY H.TransNo, GLineSeq`;

    let OpenGRs = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode, VendorCode: req.query.VendorCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let TaxColumns = [
      "TransNo",
      "GLineSeq",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxRate",
      "TaxAmount",
      "TaxAmount_Cur"
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let BatchColumns = [
      "TransNo",
      "GLineSeq",
      "BatchNo",
      "ExpiryDate",
      "Quantity",
      "BaseQuantity"
    ];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.POP_GoodsReceiptTaxes.findAll({ attributes: TaxColumns })
    let BatchesData = await req.dbconn.POP_GoodsReceiptBatches.findAll({ attributes: BatchColumns })

    OpenGRs = JSON.stringify(OpenGRs)
    OpenGRs = JSON.parse(OpenGRs)

    await Promise.all(
      OpenGRs.map(async val => {
        val.Taxes = TaxesData.filter(v => v.GLineSeq === val.GLineSeq && v.TransNo === val.GTransNo)
        val.Batches = BatchesData.filter(v => v.GLineSeq === val.GLineSeq && v.TransNo === val.GTransNo)
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)
        return val;
      })
    )

    const grouped = _.groupBy(OpenGRs, pr => pr.GTransNo);
    let Data = []
    Object.keys(grouped).forEach(function (key, index) {
      Data.push({
        TransNo: key,
        ItemData: grouped[key]
      })
    });

    ResponseLog.Send200(req, res, {
      OpenGRs: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.ReturnItems = async (req, res) => {
  try {

    let sQuery = `SELECT G.TransNo, GLineSeq= S.[LineNo], S.ItemCode, Item, UOMCode, UOM, TaxScheduleCode, TaxSchedule, UnitQuantity, G.LocationCode, G.Location, I.ItemType, I.ItemTrackBy, Price = AVG(UnitPrice), 
    Quantity = SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0))), 
    BaseQuantity = SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0))), 
    QtyBal = SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0))),
    SubTotal=AVG(UnitPrice) * SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0))),
    SubTotal_Cur=AVG(UnitPrice) * SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0)))
    FROM INV_StockMaster S
    LEFT OUTER JOIN (SELECT HeaderNo, QtyOut = SUM(QtyOut) FROM INV_StockAlloc GROUP BY HeaderNo) AS A ON S.HeaderNo = A.HeaderNo
    LEFT OUTER JOIN (SELECT HeaderNo, QtyOut = SUM(QtyOut) FROM INV_StockDetail GROUP BY HeaderNo) AS D ON S.HeaderNo = D.HeaderNo
    INNER JOIN (SELECT ItemCode, ItemType, ItemTrackBy, UOMCode, UOM, TaxScheduleCode, TaxSchedule, UnitQuantity FROM INV_Item) I ON I.ItemCode = S.ItemCode 
    INNER JOIN POP_GoodsReceiptMaster G ON G.TransNo = S.TransNo
    WHERE G.LocationCode = :LocationCode AND G.VendorCode = :VendorCode 
    GROUP BY G.TransNo,  S.[LineNo], G.LocationCode, S.ItemCode, Item, UOMCode, UOM,TaxScheduleCode, TaxSchedule, UnitQuantity, G.Location, I.ItemType, I.ItemTrackBy
    HAVING SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0))) > 0
    ORDER BY G.TransNo,  S.[LineNo]`;

    let ItemData = await req.dbconn.sequelize.query(sQuery, {
      replacements: { LocationCode: req.query.LocationCode, VendorCode: req.query.VendorCode },
      type: req.dbconn.Sequelize.QueryTypes.SELECT,
    });

    let TaxColumns = [
      "TaxScheduleID",
      "TaxScheduleCode",
      "TaxSchedule",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxType",
      "AcctCode",
      "AcctDesc",
      "TaxRate",
      [req.dbconn.sequelize.literal('0'), "TaxAmount"],
      [req.dbconn.sequelize.literal('0'), "TaxAmount_Cur"]
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.FIN_TaxScheduleDetail.findAll({ attributes: TaxColumns })

    ItemData = JSON.stringify(ItemData)
    ItemData = JSON.parse(ItemData)

    await Promise.all(
      ItemData.map(async val => {

        let TaxesD = TaxesData.filter(v => v.TaxScheduleCode === val.TaxScheduleCode)
        let TaxesArray = []
        let TaxAmount = 0

        TaxesD.map(t => {
          TaxAmount += (val.Amount * t.TaxRate) / 100
          let Item = {
            TaxDetailID: t.TaxDetailID,
            TaxDetailCode: t.TaxDetailCode,
            TaxDetail: t.TaxDetail,
            TaxRate: t.TaxRate,
            TaxAmount: (val.Amount * t.TaxRate) / 100,
            TaxAmount_Cur: (val.Amount * t.TaxRate) / 100
          }
          TaxesArray.push(Item)
        })
        val.TaxAmount = TaxAmount
        val.TaxAmount_Cur = TaxAmount
        val.NetAmount = TaxAmount + val.Amount
        val.NetAmount_Cur = TaxAmount + val.Amount

        val.Taxes = TaxesArray;
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )

    const grouped = _.groupBy(ItemData, pr => pr.TransNo);
    let Data = []
    Object.keys(grouped).forEach(function (key, index) {
      Data.push({
        TransNo: key,
        ItemData: grouped[key]
      })
    });

    ResponseLog.Send200(req, res, {
      Item: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};


