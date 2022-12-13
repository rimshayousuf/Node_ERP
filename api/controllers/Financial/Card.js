const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
      let Columns = ["CardCode","CardName","Phone1","Email","IsActive"]
      let Card = await SeqFunc.getAll(req.dbconn.FIN_Cards,{},true,Columns);
    if (Card.success) {
      ResponseLog.Send200(req, res, Card.Data);
    } else {
      ResponseLog.Send200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let Card = await SeqFunc.getOne(req.dbconn.FIN_Cards,{where: {CardCode:req.query.CardCode}});

    if (Card.success) {
      ResponseLog.Send200(req, res, Card.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let Card = await SeqFunc.Delete(req.dbconn.FIN_Cards,{ where: {CardCode: req.query.CardCode}});

    if (Card.success) {
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
    delete Header.CardID

    let Data = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_Cards,
      { where: {CardCode: Header.CardCode} },
      Header
    );

    if (Data.success) {
      if (Data.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
