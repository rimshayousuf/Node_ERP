const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
      let Columns = [["AgBkCode",["Bucket Code"]],["AgBkDesc",["Bucket Desc"]],"IsActive"]
      let RespData = await SeqFunc.getAll(req.dbconn.FIN_AgingBuckets,{},true,Columns);
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
    
    let RespData = await SeqFunc.getOne(req.dbconn.FIN_AgingBuckets,{where: {AgBkCode:req.query.AgBkCode}});

    if (RespData.success) {

      let DetailData = await SeqFunc.getAll(
        req.dbconn.FIN_AgingBucketsDays,
        { where: {AgBkCode: RespData.Data.AgBkCode} },
        false,
        ["AgBkDtlName","DaysDueFromUOM", "DaysDueTo"]
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
      req.dbconn.FIN_AgingBuckets,
      { where: { AgBkCode: req.query.AgBkCode } },
    );

    if (RespData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_AgingBucketsDays, {
        where: { AgBkCode: RespData.Data.AgBkCode },
      });

      await SeqFunc.Delete(req.dbconn.FIN_AgingBuckets, {
        where: { AgBkCode: RespData.Data.AgBkCode },
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
    delete Header.AgBkID

    let RespData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_AgingBuckets,
      { where: { AgBkCode: Header.AgBkCode } },
      Header
    );

    if (RespData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_AgingBucketsDays, {
        where: { AgBkCode: RespData.Data.AgBkCode },
      });

      Detail.map(o => {
        delete o.AgBkDtlID
        o.AgBkID = RespData.Data.AgBkID
        o.AgBkCode = RespData.Data.AgBkCode
        o.AgBkDesc = RespData.Data.AgBkDesc
        return o
      })
      await SeqFunc.bulkCreate(req.dbconn.FIN_AgingBucketsDays, Detail);

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

