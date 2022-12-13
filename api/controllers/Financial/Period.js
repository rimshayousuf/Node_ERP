const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const con = require("../../../AppConfig")


exports.getList = async (req, res) => {
    try {
      let Columns = ["YearID",["StartDateR","StartDate"],["EndDateR","EndDate"],"Closed"]
      let RespData = await SeqFunc.getAll(req.dbconn.FIN_FiscalYear,{},true,Columns);

    if (RespData.success) {

      RespData?.Data?.rows?.map(v => {
        v.StartDateR = con.MomentformatDate(v.StartDate)
        v.EndDateR = con.MomentformatDate(v.EndDate)
        return v
      })

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
    
    let RespData = await SeqFunc.getOne(req.dbconn.FIN_FiscalYear,{where: {YearID:req.query.YearID}});

    if (RespData.success) {

      let DetailData = await SeqFunc.getAll(
        req.dbconn.FIN_FiscalPeriod,
        { where: {YearID: req.query.YearID} },
        false,
        ["Period","StartDate","EndDate","Financial","Purchases","Sales","Inventory","Manufacturing","Closed"]
      );
      let Data = {
        Header: RespData.Data,
        Detail: DetailData.Data,
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
    
    let RespData = await SeqFunc.getOne(
      req.dbconn.FIN_FiscalYear,
      { where: { YearID: req.query.YearID } }
    );

    console.log({RespData})
    if (RespData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_FiscalPeriod, {
        where: { YearID: RespData.Data.YearID },
      });

      await SeqFunc.Delete(req.dbconn.FIN_FiscalYear, {
        where: { YearID: RespData.Data.YearID },
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
  try {
    let Header = req.body.Header;
    let Detail = req.body.Detail;
    // delete Header.TaxSchduleID

    let RespData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_FiscalYear,
      { where: { YearID: Header.YearID } },
      Header
    );

    if (RespData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_FiscalPeriod, {
        where: { YearID: RespData.Data.YearID },
      });

      Detail.map(o => {
        delete o.PeriodID
        o.YearID = RespData.Data.YearID
        o.Closed = RespData.Data.Closed
        return o
      })

      await SeqFunc.bulkCreate(req.dbconn.FIN_FiscalPeriod, Detail);

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

