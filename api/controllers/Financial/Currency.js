const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
  try {
    let Columns = [["CurCode",["Currency Code"]], ["CurName",["Currency Desc"]], ["CurSymbol",["Symbol"]]]
    let RespData = await SeqFunc.getAll(req.dbconn.FIN_Currencies, {}, true, Columns);
    if (RespData.success) {
      ResponseLog.Send200(req, res, RespData.Data);
    } else {
      ResponseLog.Send200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {

    let RespData = await SeqFunc.getOne(req.dbconn.FIN_Currencies, { where: { CurCode: req.query.CurCode } });

    if (RespData.success) {
      ResponseLog.Send200(req, res, RespData.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let RespData = await SeqFunc.Delete(req.dbconn.FIN_Currencies, { where: { CurCode: req.query.CurCode } });

    if (RespData.success) {
      ResponseLog.Delete200(req, res);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.CreateOrUpdate = async (req, res) => {
  try {
    let Header = req.body.Header;

    let RespData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_Currencies,
      { where: { CurCode: Header.CurCode } },
      Header
    );

    if (RespData.success) {
      if (RespData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.ExchangeRateCreateOrUpdate = async (req, res) => {
  try {
    let Header = req.body.Header;

    await SeqFunc.Delete(req.dbconn.FIN_ExchRates, {
      where: { Tran_CurID: req.body.Tran_CurID },
    });

    Header.map(o => {
      o.Tran_CurID = req.body.Tran_CurID
      o.ConvMethd = 0
      o.Base_CurID = 1
      return o
    })
    await SeqFunc.bulkCreate(req.dbconn.FIN_ExchRates, Header);

    ResponseLog.Update200(req, res);
  } catch (err) {
    console.log(err)
    ResponseLog.Error200(req, res, err.message);
  }
};
