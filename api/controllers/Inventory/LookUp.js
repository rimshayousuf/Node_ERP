const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const MaterialData = require("../../../core/MaterialData");
const { Op } = require("sequelize");

exports.getLocations = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["LocationCode", "Location"];
    let Location = await SeqFunc.LookUp(req.dbconn.INV_Location, { where: { IsActive: true, IsTransit: false } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Location: Location.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getInTransitLocations = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["LocationCode", "Location"];
    let Location = await SeqFunc.LookUp(req.dbconn.INV_Location, { where: { IsActive: true, IsTransit: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Location: Location.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getInventoryItems = async (req, res) => {
  try {
    let sQuery = `SELECT S.ItemCode, Item, UOMCode, UOM, TaxScheduleCode, TaxSchedule, TaxScheduleID, UnitQuantity, LocationCode, Location, ItemType='Inventoried Item', ItemTrackBy, Price = AVG(UnitPrice), QtyIn = SUM(Quantity), 
                    QtyAlloc = SUM(ISNULL(A.QtyOut,0)), QtyOut = SUM(ISNULL(D.QtyOut,0)), QtyBal = SUM(Quantity) - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0)))FROM INV_StockMaster S
                    LEFT OUTER JOIN (SELECT HeaderNo, QtyOut = SUM(QtyOut) FROM INV_StockAlloc GROUP BY HeaderNo) AS A ON S.HeaderNo = A.HeaderNo
                    LEFT OUTER JOIN (SELECT HeaderNo, QtyOut = SUM(QtyOut) FROM INV_StockDetail GROUP BY HeaderNo) AS D ON S.HeaderNo = D.HeaderNo
                    INNER JOIN (SELECT ItemCode, UOMCode, UOM, TaxScheduleCode, TaxSchedule, TaxScheduleID, UnitQuantity FROM INV_Item) I ON I.ItemCode = S.ItemCode 
                    WHERE LocationCode = :LocationCode
                    GROUP BY LocationCode, S.ItemCode, Item, UOMCode, UOM,TaxScheduleCode, TaxSchedule, TaxScheduleID, UnitQuantity, Location, ItemTrackBy`;

    let ItemData = await req.dbconn.sequelize.query(sQuery, {
      replacements: { LocationCode: req.query.LocationCode },
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

    let UOMColumns = ["ItemCode", "UOMCode", "UOM", "UnitQuantity"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.FIN_TaxScheduleDetail.findAll({ attributes: TaxColumns })

    ItemData = JSON.stringify(ItemData)
    ItemData = JSON.parse(ItemData)

    await Promise.all(
      ItemData.map(async val => {
        val.Taxes = TaxesData.filter(v => v.TaxScheduleCode === val.TaxScheduleCode)
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )

    let columns = ["ItemCode", "Item", "Location", "ItemType", "ItemTrackBy", "Price", "QtyBal"]
    let Data = await MaterialData.LookUp(ItemData, columns);

    ResponseLog.Send200(req, res, {
      Item: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getItems = async (req, res) => {
  try {
    let sQuery = `SELECT
                  I.ItemCode,
                  I.Item,
                  UOMCode,
                  UOM,
                  TaxScheduleCode,
                  TaxSchedule,
                  TaxScheduleID,
                  UnitQuantity,
                  LocationCode,
                  LOCATION,
                  ItemType,
                  ItemTrackBy,
                  Price = LSTPPRICE
                FROM
                  INV_Item I 
                INNER JOIN INV_ItemLocation L ON L.ItemCode = I.ItemCode 
                WHERE LocationCode = :LocationCode`;

    let ItemData = await req.dbconn.sequelize.query(sQuery, {
      replacements: { LocationCode: req.query.LocationCode },
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

    let UOMColumns = ["ItemCode", "UOMCode", "UOM", "UnitQuantity"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })
    let TaxesData = await req.dbconn.FIN_TaxScheduleDetail.findAll({ attributes: TaxColumns })

    ItemData = JSON.stringify(ItemData)
    ItemData = JSON.parse(ItemData)
    await Promise.all(
      ItemData.map(async val => {
        val.Taxes = TaxesData.filter(v => v.TaxScheduleCode === val.TaxScheduleCode)
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)
        val.disabled = true
        return val;
      })
    )


    let columns = ["ItemCode", "Item", "ItemType", "ItemTrackBy", "Price"]
    let Data = await MaterialData.LookUp(ItemData, columns);

    ResponseLog.Send200(req, res, {
      Item: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getFilterItems = async (req, res) => {
  try {
    let sQuery = `EXEC [dbo].[GetFilteredItems] :ItemClass,'','{}'`;

    let ItemData = await req.dbconn.sequelize.query(sQuery, {
      replacements: { ItemClass: req.query.ItemClassCode },
      type: req.dbconn.Sequelize.QueryTypes.SELECT,
    });

    ItemData = JSON.stringify(ItemData)
    ItemData = JSON.parse(ItemData)

    let columns = ["ItemCode", "Item", "ItemType", "ItemTrackBy", "Price"]
    let Data = await MaterialData.LookUp(ItemData, columns);

    ResponseLog.Send200(req, res, {
      Item: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getItemUOM = async (req, res) => {
  try {

    let Columns = [];

    Columns = ["UOMCode", "UOM", "UnitQuantity"];
    let ItemUOM = await SeqFunc.LookUp(req.dbconn.INV_ItemUOM, { where: { ItemCode: req.query.ItemCode, IsActive: 1 } }, true, Columns);
    ResponseLog.Send200(req, res, {
      ItemUOM: ItemUOM.Data,
    });

  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getUOMClass = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["UOMHeaderCode", "UOMHeader"];
    let UOMClass = await SeqFunc.LookUp(req.dbconn.INV_UOMHeader, { where: { IsActive: true } }, true, Columns);

    ResponseLog.Send200(req, res, {
      UOMClass: UOMClass.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getUOM = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["UOMCode", "UOM"];

    let sQuery = `SELECT UOMCode=BaseUOMCode, UOMDID = UOMDID, UOM = D.UOM, UnitQuantity=1, disable='true' FROM INV_UOMHeader H
    INNER JOIN INV_UOMDetail D ON H.UOMHeaderCode = D.UOMHeaderCode AND H.BaseUOMCode = D.UOMCode
    WHERE H.UOMHeaderCode = :UOMHeaderCode`

    let UOMBase = await req.dbconn.sequelize.query(sQuery, { replacements: { UOMHeaderCode: req.query.UOMHeaderCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let UOMClass = await SeqFunc.LookUp(req.dbconn.INV_UOMDetail, { where: { UOMHeaderCode: req.query.UOMHeaderCode, UOMCode: { [Op.ne]: UOMBase[0].UOMCode }, IsActive: true } }, true, Columns);

    ResponseLog.Send200(req, res, {
      UOMClass: UOMClass.Data,
      UOMBase: UOMBase
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getAttributeHeads = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["AttHeadCode", "AttHead"];
    let AttributeHead = await SeqFunc.LookUp(req.dbconn.INV_AttributeHead, { where: { IsActive: true } }, true, Columns);

    ResponseLog.Send200(req, res, {
      AttributeHead: AttributeHead.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getAttributeCodes = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["AttCode", "AttValue"];
    let AttributeCode = await SeqFunc.LookUp(req.dbconn.INV_AttributeCode, { where: { AttHeadCode: req.query.AttHeadCode } }, true, Columns);

    ResponseLog.Send200(req, res, {
      AttributeCode: AttributeCode.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getItemClass = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["ItemClassCode", "ItemClass"];
    let ItemClass = await SeqFunc.LookUp(req.dbconn.INV_ItemClass, { where: { IsActive: 1 } }, true, Columns);

    ResponseLog.Send200(req, res, {
      ItemClass: ItemClass.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getItemClassAttributes = async (req, res) => {
  try {
    let Columns = ["AttributeCode", "AttributeType", "IsVariant", "AttHeadCode", "AttHead"];
    let ItemClass = await req.dbconn.INV_ItemClassAttributes.findAll({ where: { ItemClassCode: req.query.ItemClassCode }, attributes: Columns });

    ItemClass = JSON.stringify(ItemClass)
    ItemClass = JSON.parse(ItemClass)

    let Count = 1;
    await Promise.all(
      ItemClass.map(async v => {

        if (v.AttributeType === 'DropDown') {
          let AttributeCode = await req.dbconn.INV_AttributeCode.findAll({ where: { AttHeadCode: v.AttHeadCode }, attributes: ["AttCode", "AttValue"] });

          v.Label = v.AttributeCode
          v.Data = AttributeCode

          Count++
        }

        return v;
      })
    )
    ResponseLog.Send200(req, res, {
      ItemClass: ItemClass,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOpenIRs = async (req, res) => {
  try {

    let sqlQuery = `SELECT RTransNo=H.TransNo, RLineSeq, D.ItemCode, D.Item, D.ItemTrackBy, D.ItemType, UOMCode, UOM, UnitQuantity, 
                      BaseQuantity = BaseQuantity - (UsedQuantity + CanceledQuantity),
                      Quantity,
                      AvailableQuantity = BaseQuantity - (UsedQuantity + CanceledQuantity),
                      QtyBal = dbo.GetInventoryStock(D.ItemCode,:SrcLocationCode)
                      FROM INV_RequisitionMaster H
                      INNER JOIN  INV_RequisitionDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                      LEFT OUTER JOIN vw_Stock S ON S.ItemCode = D.ItemCode AND H.LocationCode = S.LocationCode
                      WHERE H.SubmitStatus = 1 AND H.LocationCode = :LocationCode AND BaseQuantity - (UsedQuantity + CanceledQuantity) > 0`;

    let OpenIRs = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode, SrcLocationCode: req.query.SourceLocationCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let UOMColumns = ["UOMCode", "UOM", "UnitQuantity", "ItemCode"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })

    OpenIRs = JSON.stringify(OpenIRs)
    OpenIRs = JSON.parse(OpenIRs)

    await Promise.all(
      OpenIRs.map(async val => {
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )

    let columns = ["RTransNo", "ItemCode", "Item", "UOM", "AvailableQuantity", ["QtyBal", "StockQuantity"]]
    let Data = await MaterialData.LookUp(OpenIRs, columns);

    ResponseLog.Send200(req, res, {
      OpenIRs: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOpenTransfers = async (req, res) => {
  try {

    let sqlQuery = `SELECT TransNo = H.TransNo, H.LocationCode, H.Location, TLineSeq, D.ItemCode, D.Item, ItemTrackBy, ItemType, 
                      UOMCode, UOM, 
                      UnitQuantity,
                      BaseQuantity = BaseQuantity - ISNULL(QtyUsed,0), 
                      Quantity = (BaseQuantity - ISNULL(QtyUsed,0)) / UnitQuantity,
                      AvailableQuantity = BaseQuantity - ISNULL(QtyUsed,0),
                      UnitCost,
                      D.RTransNo,
                      D.RLineSeq,
                      SrcTNo=H.TransNo,
                      SrcTLineSeq=TLineSeq
                      FROM INV_TransferHeader H
                      INNER JOIN INV_TransferDetail D ON H.TransNo = D.TransNo AND D.LineStatus = 0
                      WHERE H.Posted = 1 AND H.DestinationLocationCode = :LocationCode  AND H.TransType = 'IXFR'`;

    let OpenTransfers = await req.dbconn.sequelize.query(sqlQuery, { replacements: { LocationCode: req.query.LocationCode }, type: req.dbconn.Sequelize.QueryTypes.SELECT })

    ResponseLog.Send200(req, res, { OpenTransfers: OpenTransfers });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getItemAssign = async (req, res) => {
  try {
    let Columns = ["ItemCode", "Item","ItemClassCode","ItemClass"];
    let Items = await SeqFunc.LookUp(req.dbconn.INV_Item, { }, true, Columns);

    ResponseLog.Send200(req, res, {
      Items: Items.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
}

