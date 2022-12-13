const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.getList = async (req, res) => {
  try {
    let Columns = [["AttHeadCode","Attribute Head Code"],["AttHead","Attribute Head Desc"],"IsActive"];
    let Attribute = await SeqFunc.getAll(req.dbconn.INV_AttributeHead, {}, true, Columns);
    if (Attribute.success) {
      ResponseLog.Send200(req, res, Attribute.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let Attribute = await SeqFunc.getOne(req.dbconn.INV_AttributeHead, { where:{AttHeadCode: req.query.AttHeadCode} });

    if (Attribute.success) {
      let AttributeDetail = await SeqFunc.getAll(
        req.dbconn.INV_AttributeCode,
        { where: {AttHeadCode: req.query.AttHeadCode} },
        false,
        [["AttCodeID","Attribute Code"],["AttCodeDesc","Attribute Desc"]]
      );
      if (AttributeDetail.success) {
        let Data = {
          Header: Attribute.Data,
          Detail: AttributeDetail.Data
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
    let Attributes = await SeqFunc.getOne(
      req.dbconn.INV_AttributeHead,
      {
        where: { AttHeadCode: req.query.AttHeadCode },
      }
    );

    if (Attributes.success) {
      await SeqFunc.Delete(req.dbconn.INV_AttributeCode, {
        where: { AttHeadCode: req.query.AttHeadCode },
      });
      await SeqFunc.Delete(req.dbconn.INV_AttributeHead, {
        where: { AttHeadCode: req.query.AttHeadCode },
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
    delete Header.AttHeadID

    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.PostedUser = req.headers.username;

    let AttData = await SeqFunc.updateOrCreate(
      req.dbconn.INV_AttributeHead,
      { where:{AttHeadCode: Header.AttHeadCode} },
      Header
    );

    if (AttData.success) {
      await SeqFunc.Delete(req.dbconn.INV_AttributeCode, { where:{AttHeadCode: Header.AttHeadCode} });

      Detail.map(o => {
        o.AttHeadID = AttData.Data.AttHeadID
        o.AttHeadCode = AttData.Data.AttHeadCode
        o.AttHead = AttData.Data.AttHead
        o.IsActive = true
        return o
      })

      await SeqFunc.bulkCreate(req.dbconn.INV_AttributeCode,Detail)

      if (AttData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
