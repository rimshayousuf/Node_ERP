const db = require("../../models/index");
const ResponseLog = require("../../../core/ResponseLog");
const Tree = require("../../../core/Tree");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require('lodash')

exports.getMenu = async (req, res) => {
  try {

    let query = `SELECT M.ControlID, M.ControlName, FormType=P.ControlName, 
                  FormTypeID=P.ControlID, 
                  Module=ISNULL(PP.ControlName,P.ControlName), 
                  ModuleID=ISNULL(PP.ControlID,P.ControlID), 
                  SortBy = M.SortOrder,
                  [Create] = 0, [View] = 0,[Edit] = 0, [Delete] = 0, [Post] = 0
                  FROM MENU M 
                  LEFT OUTER JOIN Menu P ON M.PCID = P.ControlID
                  LEFT OUTER JOIN Menu PP ON P.PCID = PP.ControlID
                  WHERE M.ControlType = 'Frm'
                  ORDER BY PP.SortOrder`

    db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
      .then((data) => {
        data = JSON.stringify(data)
        data = JSON.parse(data)

        const grouped = _.groupBy(data, type => type.Module);

        ResponseLog.Send200(req, res, grouped);
      })
      .catch((err) => {
        console.log({ err })
        ResponseLog.Error200(req, res, err.message);
      });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getRoles = async (req, res) => {
  try {

    db.Roles.findAll({
      attributes:["RoleID","RoleName"],
      where: { IsActive: 1, RoleID: { [Op.ne]: 1 } },
    })
      .then((data) => {
        data = JSON.stringify(data)
        data = JSON.parse(data)

        ResponseLog.Send200(req, res, data);
      })
      .catch((err) => {
        console.log({ err })
        ResponseLog.Error200(req, res, err.message);
      });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};



