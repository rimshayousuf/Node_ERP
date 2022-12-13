const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
      let Columns = ["TaxScheduleCode","TaxSchedule","IsActive"]
      let RespData = await SeqFunc.getAll(req.dbconn.FIN_TaxSchedule,{},true,Columns);
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
    
    let RespData = await SeqFunc.getOne(req.dbconn.FIN_TaxSchedule,{where: {TaxScheduleCode:req.query.TaxScheduleCode}});

    if (RespData.success) {

      let DetailData = await SeqFunc.getAll(
        req.dbconn.FIN_TaxScheduleDetail,
        { where: {TaxScheduleCode:req.query.TaxScheduleCode} },
        false,
        ["TaxDetailID","TaxDetail","TaxDetailCode","TaxType","AcctCode","AcctDesc","TaxRate"]
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
      req.dbconn.FIN_TaxSchedule,
      { where: { TaxScheduleCode: req.query.TaxScheduleCode } }
    );

    if (RespData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_TaxScheduleDetail, {
        where: { TaxScheduleCode: RespData.Data.TaxScheduleCode },
      });

      await SeqFunc.Delete(req.dbconn.FIN_TaxSchedule, {
        where: { TaxScheduleCode: RespData.Data.TaxScheduleCode },
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
    delete Header.TaxScheduleID

    let RespData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_TaxSchedule,
      { where: { TaxScheduleCode: Header.TaxScheduleCode } },
      Header
    );

    if (RespData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_TaxScheduleDetail, {
        where: { TaxScheduleCode: RespData.Data.TaxScheduleCode },
      });

      Detail.map(o => {
        delete o.RID
        o.TaxScheduleID = RespData.Data.TaxScheduleID
        o.TaxScheduleCode = RespData.Data.TaxScheduleCode
        o.TaxSchedule = RespData.Data.TaxSchedule
        return o
      })
      await SeqFunc.bulkCreate(req.dbconn.FIN_TaxScheduleDetail, Detail);

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

