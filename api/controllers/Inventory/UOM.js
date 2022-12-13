const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.getList = async (req, res) => {
  try {
    let Columns = ["UOMHeaderCode","UOMHeader","BaseUOMCode","IsActive"];
    let UOM = await SeqFunc.getAll(req.dbconn.INV_UOMHeader, {}, true, Columns);
    if (UOM.success) {
      ResponseLog.Send200(req, res, UOM.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let UOM = await SeqFunc.getOne(req.dbconn.INV_UOMHeader, { where:{UOMHeaderCode: req.query.UOMHeaderCode} });

    if (UOM.success) {
      let UOMDetail = await SeqFunc.getAll(
        req.dbconn.INV_UOMDetail,
        { where:{UOMHeaderCode: req.query.UOMHeaderCode} },
        false,
        ["UOMCode","UOM"]
      );
      if (UOMDetail.success) {
        let Data = {
          Header: UOM.Data,
          Detail: UOMDetail.Data
        }
        ResponseLog.Send200(req, res, Data);
      } else {
        ResponseLog.Error200(req, res, "No Record Found!");
      }
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    let UOM = await SeqFunc.getOne(
      req.dbconn.INV_UOMHeader,
      {
        where: { UOMHeaderCode: req.query.UOMHeaderCode },
      }
    );

    if (UOM.success) {
      await SeqFunc.Delete(req.dbconn.INV_UOMDetail, {
        where: { UOMHeaderCode: req.query.UOMHeaderCode },
      });
      await SeqFunc.Delete(req.dbconn.INV_UOMHeader, {
        where: { UOMHeaderCode: req.query.UOMHeaderCode },
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
    delete Header.UOMHID
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.PostedUser = req.headers.username;

    let UOMData = await SeqFunc.updateOrCreate(
      req.dbconn.INV_UOMHeader,
      { where:{UOMHeaderCode: Header.UOMHeaderCode} },
      Header
    );

    if (UOMData.success) {
      await SeqFunc.Delete(req.dbconn.INV_UOMDetail, { where:{UOMHeaderCode: Header.UOMHeaderCode} });

      Detail.map(o => {
        o.UOMHID = UOMData.Data.UOMHID
        o.UOMHeaderCode = UOMData.Data.UOMHeaderCode
        o.UOMHeader = UOMData.Data.UOMHeader
        o.IsActive = true
        delete o.UOMDID
        return o
      })

      await SeqFunc.bulkCreate(req.dbconn.INV_UOMDetail,Detail)

      if (UOMData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
