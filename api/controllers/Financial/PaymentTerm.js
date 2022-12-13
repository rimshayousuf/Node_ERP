const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
      let Columns = ["PayTermCode","PayTermDesc","IsActive"]
      let RespData = await SeqFunc.getAll(req.dbconn.FIN_PayTerms,{},true,Columns);
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
    
    let RespData = await SeqFunc.getOne(req.dbconn.FIN_PayTerms,{where: {PayTermCode:req.query.PayTermCode}});

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
    let RespData = await SeqFunc.Delete(req.dbconn.FIN_PayTerms,{ where: {PayTermCode: req.query.PayTermCode}});

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
    delete Header.CatID

    let RespData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_PayTerms,
      { where: {PayTermCode: Header.PayTermCode} },
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
