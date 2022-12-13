const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.getList = async (req, res) => {
  try {
    let Columns = ["ItemClassCode","ItemClass","IsActive"];
    let ItemClass = await SeqFunc.getAll(req.dbconn.INV_ItemClass, {}, true, Columns);
    if (ItemClass.success) {
      ResponseLog.Send200(req, res, ItemClass.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let ItemClass = await SeqFunc.getOne(req.dbconn.INV_ItemClass, { where:{ItemClassCode: req.query.ItemClassCode} });

    if (ItemClass.success) {
      let AttributeDetail = await SeqFunc.getAll(
        req.dbconn.INV_ItemClassAttributes,
        { where:{ItemClassCode: req.query.ItemClassCode} },
        false,
        ["AttributeCode","AttributeType","IsVariant"]
      );
      if (AttributeDetail.success) {
        let Data = {
          Header: ItemClass.Data,
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
    let ItemClassData = await SeqFunc.getOne(
      req.dbconn.INV_ItemClass,
      { where: { ItemClassCode: req.query.ItemClassCode } },
      Header
    );

    if (ItemClassData.success) {
      await SeqFunc.Delete(req.dbconn.INV_ItemClassAttributes, {
        where: { ItemClassCode: ItemClassData.Data.ItemClassCode },
      });

      await SeqFunc.Delete(req.dbconn.INV_ItemClass, {
        where: { ItemClassCode: ItemClassData.Data.ItemClassCode },
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
    delete Header.ItemClassID
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;
    Header.PostedUser = req.headers.username;

    let ItemClassData = await SeqFunc.updateOrCreate(
      req.dbconn.INV_ItemClass,
      { where:{ItemClassCode: Header.ItemClassCode} },
      Header
    );

    if (ItemClassData.success) {
      await SeqFunc.Delete(req.dbconn.INV_ItemClassAttributes, { where:{ItemClassCode: Header.ItemClassCode} });

      Detail.map(o => {
        delete o.IAttID
        o.ItemClassID = ItemClassData.Data.ItemClassID
        o.ItemClassCode = ItemClassData.Data.ItemClassCode
        o.ItemClass = ItemClassData.Data.ItemClass
        o.IsActive = true
      })

      await SeqFunc.bulkCreate(req.dbconn.INV_ItemClassAttributes,Detail)

      if (ItemClassData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
