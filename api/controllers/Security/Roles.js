const db = require("../../models/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Tree = require("../../../core/Tree");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require('lodash')

exports.getList = async (req, res) => {
  try {
    let Columns = ["RoleName","Remarks", "IsActive"];
    let Roles = await SeqFunc.getAll(db.Roles, { where : { RoleID :{ [Op.ne] : 1 }}}, true, Columns);
    if (Roles.success) {
      ResponseLog.Send200(req, res, Roles.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {

    let Roles = await SeqFunc.getOne(db.Roles, { where: {RoleID: req.query.RoleID }});

    if (Roles.success) {

      let query = `SELECT M.*,
                    [Create] = ISNULL(R.[Create],0), [View] = ISNULL(R.[View],0),[Edit] = ISNULL(R.[Edit],0), 
                                        [Delete] = ISNULL(R.[Delete],0), [Post] = ISNULL(R.[Post],0)
                    FROM (SELECT M.ControlID, M.ControlName, FormType=P.ControlName, 
                            FormTypeID=P.ControlID, 
                            Module=ISNULL(PP.ControlName,P.ControlName), 
                            ModuleID=ISNULL(PP.ControlID,P.ControlID), 
                            PP.SortOrder
                            FROM MENU M 
                            LEFT OUTER JOIN Menu P ON M.PCID = P.ControlID
                            LEFT OUTER JOIN Menu PP ON P.PCID = PP.ControlID
                            WHERE M.ControlType = 'Frm' AND M.IsActive = 1
                    ) M
                    LEFT OUTER JOIN RoleDetail R ON R.ControlID = M.ControlID AND R.RoleID = ${req.query.RoleID}`

      let RoleDetail = await db.sequelize.query(query, { replacements: { LocationCode: req.query.LocationCode }, type: db.Sequelize.QueryTypes.SELECT })

      const grouped = _.groupBy(RoleDetail, type => type.Module);

      if (RoleDetail.length > 0) {
        let Data = {
          Header: Roles.Data,
          Detail: grouped
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
    let Roles =  await SeqFunc.getOne(db.Roles, { where: {RoleID: req.query.RoleID }});


    if (Roles.success) {

      await SeqFunc.Delete(db.RoleDetail, { where: {RoleID: req.query.RoleID }});
      await SeqFunc.Delete(db.Roles, { where: {RoleID: req.query.RoleID }});

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

    let RoleData = await SeqFunc.updateOrCreate(
      db.Roles,
      { where: {RoleID: Header.RoleID ? Header.RoleID : 0 }},
      Header
    );

    if (RoleData.success) {
      await SeqFunc.Delete(db.RoleDetail, { where: {RoleID: RoleData.Data.RoleID}});

      Detail.map(o => {
        o.RoleID = RoleData.Data.RoleID
        o.ControlID = o.ControlID
        o.Remarks = ''
        return o
      })

      await SeqFunc.bulkCreate(db.RoleDetail,Detail)

      if (RoleData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    console.log(err)
    ResponseLog.Error200(req, res, err.message);
  }
};
