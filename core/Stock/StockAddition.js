const AppConfig = require("./../../AppConfig");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.Addition = async (db, model, TransNo,LocationCode, Location,TransType, LCAmount, TransTotal, res) => {
  try {
    let Data = await model.findAll({ where: { TransNo: TransNo } });

    Data = JSON.stringify(Data)
    Data = JSON.parse(Data)

    Data.map((d) => {
      let ProPrice
      if (LCAmount > 0) {
        let LineAmount = d.Amount
        let ProRate = (LineAmount / TransTotal) * LineAmount
        let ProAmount = ProRate + LineAmount
        ProPrice = ProAmount / d.BaseQuantity
      }
      else {
        ProPrice = d.Price
      }


      d.LocationCode = LocationCode
      d.Location = Location
      d.RecordDate = new Date()
      d.BatchNo = ''
      d.TransType = d.FormType ? d.FormType : TransType 
      d.ExpiryDate = '01-01-1900'
      d.LineNo = TransType === 'GR' ? d.GLineSeq : d.TLineSeq
      d.Quantity = d.BaseQuantity
      d.UnitPrice = ProPrice
      d.QtySold = 0
      d.QtyAlloc = 0
      d.Status = 0
      return d
    });
    await db.INV_StockMaster.bulkCreate(Data);

    return { Success: true, Message: "Stock Added Successfully!" };
  } catch (ex) {
    console.log(ex);
    return {
      Success: false,
      Message: "Consumption Process RollBacked!",
      data: ex,
    };
  }
};

exports.RawAddition = async (req, res) => {
  try {
    let Data = req;
    await db.INV_StockMaster.sreate(Data);

    return { Success: true, Message: "Stock Added Successfully!" };
  } catch (ex) {
    console.log(ex);
    return {
      Success: false,
      Message: "Error Adding Stock!",
      data: ex,
    };
  }
};

