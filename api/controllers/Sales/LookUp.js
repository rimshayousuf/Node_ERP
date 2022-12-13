const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const MaterialData = require("../../../core/MaterialData");

exports.getOpenSalesQuotes = async (req, res) => {
  try {

    let sqlQuery = `SELECT QTransNo=H.TransNo, QLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, UOMCode, UOM, UnitQuantity, TaxScheduleCode, TaxSchedule, 
                      BaseQuantity = BaseQuantity - (ISNULL(QtyUsed,0) + ISNULL(QtyCanceled,0)),
                      Quantity,
                      AvailableQuantity = BaseQuantity - (ISNULL(QtyUsed,0) + ISNULL(QtyCanceled,0)),
                      Price=D.Price,
                      Amount=D.Amount,
                      Amount_Cur=D.Amount_Cur,
                      TaxAmount=D.TaxAmount,
                      TaxAmount_Cur=D.TaxAmount_Cur,
                      NetAmount=D.NetAmount,
                      NetAmount_Cur=D.NetAmount_Cur
                      FROM SOP_QuoteMaster H
                      INNER JOIN SOP_QuoteDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                      WHERE H.SubmitStatus = 1 AND H.LocationCode = :LocationCode`;

    let OpenSalesQuotes = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })


    let TaxColumns = [
      "TransNo",
      "QLineSeq",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxRate",
      "TaxAmount",
      "TaxAmount_Cur"
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.SOP_QuoteTaxes.findAll({ attributes: TaxColumns })

    OpenSalesQuotes = JSON.stringify(OpenSalesQuotes)
    OpenSalesQuotes = JSON.parse(OpenSalesQuotes)

    await Promise.all(
      OpenSalesQuotes.map(async val => {
        val.Taxes = TaxesData.filter(v => v.QLineSeq === val.QLineSeq && v.TransNo == val.QTransNo)
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )


    let columns = [["QTransNo", "TransNo"], "ItemCode", "Item", "UOM", "AvailableQuantity"]
    let Data = await MaterialData.LookUp(OpenSalesQuotes, columns);

    ResponseLog.Send200(req, res, {
      OpenSalesQuotes: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOpenSalesOrders = async (req, res) => {
  try {

    let sqlQuery = `SELECT OTransNo=H.TransNo, OLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, UOMCode, UOM, UnitQuantity, 
                      TaxScheduleCode, TaxSchedule,
                      BaseQuantity = BaseQuantity - (ISNULL(QtyUsed,0) + ISNULL(QtyCanceled,0)),
                      Quantity,
                      AvailableQuantity = BaseQuantity - (ISNULL(QtyUsed,0) + ISNULL(QtyCanceled,0)),
                      Price=D.Price,
                      Amount=D.Amount,
                      Amount_Cur=D.Amount_Cur,
                      TaxAmount=D.TaxAmount,
                      TaxAmount_Cur=D.TaxAmount_Cur,
                      NetAmount=D.NetAmount,
                      NetAmount_Cur=D.NetAmount_Cur,                      
                      QtyBal = dbo.GetInventoryStock(D.ItemCode,:LocationCode)
                      FROM SOP_OrderMaster H
                      INNER JOIN SOP_OrderDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                      WHERE H.SubmitStatus = 1 AND H.LocationCode = :LocationCode`;

    let OpenSalesOrders = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let TaxColumns = [
      "TransNo",
      "OLineSeq",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxRate",
      "TaxAmount",
      "TaxAmount_Cur"
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.SOP_OrderTaxes.findAll({ attributes: TaxColumns })

    OpenSalesOrders = JSON.stringify(OpenSalesOrders)
    OpenSalesOrders = JSON.parse(OpenSalesOrders)



    await Promise.all(
      OpenSalesOrders.map(async val => {
        val.Taxes = TaxesData.filter(v => v.OLineSeq === val.OLineSeq && v.TransNo === val.OTransNo)
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )



    let columns = [["OTransNo", "TransNo"], "ItemCode", "Item", "UOM", "AvailableQuantity"]
    let Data = await MaterialData.LookUp(OpenSalesOrders, columns);

    ResponseLog.Send200(req, res, {
      OpenSalesOrders: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOpenSalesDispatches = async (req, res) => {
  try {

    let sqlQuery = `SELECT DTransNo=H.TransNo, DLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, UOMCode, UOM, UnitQuantity, 
                      TaxScheduleCode, TaxSchedule,
                      BaseQuantity = BaseQuantity - (ISNULL(QtyUsed,0) + ISNULL(QtyCanceled,0)),
                      Quantity,
                      AvailableQuantity = BaseQuantity - (ISNULL(QtyUsed,0) + ISNULL(QtyCanceled,0)),
                      Price=D.Price,
                      Amount=D.Amount,
                      Amount_Cur=D.Amount_Cur,
                      TaxAmount=D.TaxAmount,
                      TaxAmount_Cur=D.TaxAmount_Cur,
                      NetAmount=D.NetAmount,
                      NetAmount_Cur=D.NetAmount_Cur,
                      QtyBal = dbo.GetInventoryStock(D.ItemCode,:LocationCode)
                      FROM SOP_DispatchMaster H
                      INNER JOIN SOP_DispatchDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                      WHERE H.Posted = 1 AND H.LocationCode = :LocationCode`;

    let OpenSalesDispatches = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let TaxColumns = [
      "TransNo",
      "DLineSeq",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxRate",
      "TaxAmount",
      "TaxAmount_Cur"
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.SOP_DispatchTaxes.findAll({ attributes: TaxColumns })

    OpenSalesDispatches = JSON.stringify(OpenSalesDispatches)
    OpenSalesDispatches = JSON.parse(OpenSalesDispatches)

    await Promise.all(
      OpenSalesDispatches.map(async val => {

        val.Taxes = TaxesData.filter(v => v.DLineSeq === val.DLineSeq && v.TransNo === val.DTransNo)
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )

    let columns = ["DTransNo", "ItemCode", "Item", "UOM", "AvailableQuantity"]
    let Data = await MaterialData.LookUp(OpenSalesDispatches, columns);

    ResponseLog.Send200(req, res, {
      OpenSalesDispatches: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.OpenReturnItems = async (req, res) => {
  try {

      let sQuery = `SELECT SDD.DLineSeq,
      DTransNo =SDM.TransNo, SDD.ItemCode, SDD.Item, SDD.UOMCode, SDD.UOM, SDD.TaxScheduleCode, SDD.TaxSchedule, SDD.UnitQuantity, SDM.LocationCode, SDM.Location, SDD.ItemType, SDD.ItemTrackBy, Price = AVG(ISNULL(IDD.Price,SDD.Price)), 
        Quantity = SUM(SDD.Quantity) - SUM(ISNULL(SDD.QtyCanceled,0)), 
        BaseQuantity = SUM(SDD.Quantity) - SUM(ISNULL(SDD.QtyCanceled,0)), 
        Amount=AVG(ISNULL(IDD.Price,SDD.Price)) * SUM(SDD.Quantity) - SUM(ISNULL(SDD.QtyCanceled,0)),
        Amount_Cur=AVG(ISNULL(IDD.Price,SDD.Price)) * SUM(SDD.Quantity) - SUM(ISNULL(SDD.QtyCanceled,0))
        FROM SOP_DispatchDetail SDD
        INNER JOIN SOP_DispatchMaster SDM ON SDD.TransNo = SDM.TransNo
        LEFT OUTER JOIN SOP_InvoiceDetail IDD ON IDD.DTransNo = SDM.TransNo AND IDD.DLineSeq = SDD.DLineSeq
        WHERE SDM.LocationCode = :LocationCode AND SDM.CustomerCode = :CustomerCode 
      GROUP BY SDD.DLineSeq, SDM.TransNo, SDM.LocationCode, SDD.ItemCode, SDD.Item, SDD.UOMCode, SDD.UOM,SDD.TaxScheduleCode, SDD.TaxSchedule, SDD.UnitQuantity, SDM.Location, SDD.ItemTrackBy, SDD.ItemType`;

    let ItemData = await req.dbconn.sequelize.query(sQuery, {
      replacements: { LocationCode: req.query.LocationCode, CustomerCode: req.query.CustomerCode },
      type: req.dbconn.Sequelize.QueryTypes.SELECT,
    });

    let TaxColumns = [
      "TransNo",
      "DLineSeq",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxRate",
      "TaxAmount",
      "TaxAmount_Cur"
    ];

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.SOP_DispatchTaxes.findAll({ attributes: TaxColumns })




    ItemData = JSON.stringify(ItemData)
    ItemData = JSON.parse(ItemData)

    await Promise.all(
      ItemData.map(async val => {

        let TaxesD = TaxesData.filter(v => v.DLineSeq === val.DLineSeq && v.TransNo ==  val.DTransNo)
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

    let columns = [["DTransNo", "TransNo"], "ItemCode", "Item", "Location", "ItemType", "ItemTrackBy", "Price"]
    let Data = await MaterialData.LookUp(ItemData, columns);

    ResponseLog.Send200(req, res, {
      Item: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};


