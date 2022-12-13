const db = require("../../models/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getList = async (req, res) => {
    try {
      let Columns = ["UserName","Designation","Email","ContactNo","IsActive"]
      let Users = await SeqFunc.getAll(db.Users,{where : {UserID : { [Op.ne] : 1 }}},true,Columns);
    if (Users.success) {
      ResponseLog.Send200(req, res, Users.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    
    let Users = await SeqFunc.getOne(db.Users,{where:{UserID:req.query.UserID}});

    if (Users.success) {
      let UserRoles = await SeqFunc.getAll(
        db.UserRoles,
        {where:{UserID:req.query.UserID}},
        false,
        ["RoleID"]
      );
      if (UserRoles.success) {
          let Role = await db.Roles.findAll({attributes:["RoleID","RoleName"]})
          let RolesArray = []
          UserRoles.Data.map(v=>{
            let R = Role.filter(r => r.RoleID === v.RoleID)
            RolesArray.push({
              RoleID: v.RoleID,
              RoleName: R[0].RoleName
            })
          })


        let Data = {
          Header: Users.Data,
          Detail: RolesArray
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
    let Users = await SeqFunc.getOne(db.Users,{where:{UserID:req.query.UserID}});

    if (Users.success) {
      await SeqFunc.Delete(db.UserRoles,{where:{UserID:req.query.UserID}});
      await SeqFunc.Delete(db.Users,{where:{UserID:req.query.UserID}});

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
    let Detail = Header.Roles;

    let Users = await SeqFunc.updateOrCreate(
      db.Users,
      { where : {UserID: Header.UserID ? Header.UserID : 0 }},
      Header
    );

    if (Users.success) {
      await SeqFunc.Delete(db.UserRoles, {where :{ UserID: Header.UserID }});

      let DetailArray = [];

      Detail.map(o => {
        DetailArray.push({
          RoleID: o,
          UserID: Header.UserID
        })
      })
      await SeqFunc.bulkCreate(db.UserRoles,DetailArray)

      if (Users.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
