const db = require("../../models/index");
const Decrypter = require("../../../core/decrypt");
const AppConfig = require("../../../AppConfig");
const ResponseLog = require("../../../core/ResponseLog");
const useragent = require("useragent");
const jwt = require("jsonwebtoken");

let response;
let sqlQuery;
exports.getOne = async (req, res) => {
  try {
    const agent = useragent.parse(req.headers["user-agent"]);

    let signvalues = {
      Session: req.body.Session,
      OS: agent.os.toString(),
      WebBrowser: agent.toString(),
      Ver: agent.toVersion(),
      HardWare: agent.device.toString(),
    };

    const token = jwt.sign(signvalues, AppConfig.JWT_KEY, {
      expiresIn: "365d",
    });

    response = {};

    sqlQuery = `SELECT UserID, Password,UserName,Designation,ContactNo=U.ContactNo,Email=U.Email, Seg1=C.Seg1, Seg2=C.Seg2, Seg3=C.Seg3, Segments=C.Segments,
                SegSize1=C.SegSize1, SegSize2=C.SegSize2, SegSize3=C.SegSize3, DefaultCurID=C.DefaultCurID, DefaultCurCode=C.DefaultCurCode, DefaultCurDesc=C.DefaultCurDesc,
                DefaultCurSymbol=C.DefaultCurSymbol, CompID=U.CompID, CompName, DB=[DB_Name], CompCode 
                FROM Users U INNER JOIN Company C ON U.CompID = C.CompID
                WHERE U.IsActive = 1 AND UserName = :UserName`;

    let userData = await db.sequelize.query(sqlQuery, {
      replacements: { UserName: req.body.UserName },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    let user = {
      ...userData[0],
      Code: userData[0].DefaultCurCode,
      CurID: userData[0].DefaultCurID,
      Description: userData[0].DefaultCurDesc,
      Symbol: userData[0].DefaultCurSymbol,
      Currency: {
        Code: userData[0].DefaultCurCode,
        CurID: userData[0].DefaultCurID,
        Description: userData[0].DefaultCurDesc,
        Symbol: userData[0].DefaultCurSymbol
      },
    };
    if (user && authenticatePassword(user.Password, req.body.Password)) {
      response.webtoken = token;
      response.UserData = user;

      sqlQuery = `SELECT id=ControlID, title=ControlName,type='collapse' FROM Menu WHERE ControlType='Menu' order by SortOrder`;

      let Module = await db.sequelize.query(sqlQuery, {
        replacements: { UserID: user.UserID },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      Module = JSON.stringify(Module)
      Module = JSON.parse(Module)

      sqlQuery = `SELECT id=ControlID,title=ControlName,type='collapse',PCID=PCID FROM Menu WHERE ControlType='SMnu' AND IsActive=1`;

      let PMenuData = await db.sequelize.query(sqlQuery, {
        replacements: { UserID: user.UserID },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      PMenuData = JSON.stringify(PMenuData)
      PMenuData = JSON.parse(PMenuData)

      sqlQuery = `SELECT 
                  id=Menu.ControlID,title= Menu.ControlName,type='item',
                  [url]= CASE WHEN M.ControlType = 'SMnu' THEN '/' + Menu.Module + '/' + M.ControlName  +  '/' + REPLACE(Menu.ControlName, ' ', '') 
                              ELSE  '/' + Menu.Module +  '/' + REPLACE(Menu.ControlName, ' ', '') END,
                  Menu.PCID
                  FROM Menu INNER JOIN RoleDetail RD ON RD.ControlID = Menu.ControlID
                  LEFT OUTER JOIN Menu M ON M.ControlID = Menu.PCID 
                  INNER JOIN [UserRoles] UR ON UR.RoleID = RD.RoleID
                  WHERE UR.UserID=:UserID AND Menu.PCID <> 0 AND Menu.IsActive=1`;

      let CMenuData = await db.sequelize.query(sqlQuery, {
        replacements: { UserID: user.UserID },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      CMenuData = JSON.stringify(CMenuData)
      CMenuData = JSON.parse(CMenuData)

      PMenuData.map((val) => {
        val.children = CMenuData.filter((e) => e.PCID === val.id);
        return val;
      });

      Module.map((val) => {
        if (val.id === '2') {
          val.children = CMenuData.filter((f) => f.PCID === val.id);
        } else {
          val.children = PMenuData.filter((f) => f.PCID === val.id && f.children.length > 0);
        }
        return val;
      });

      let pages = {
        id: "menu",
        type: "group",
        children: Module.filter(v => v.children.length > 0),
      };

      response.Menu = pages;

      sqlQuery = `SELECT ControlID, [Create]=RD.[Create], [Edit]=RD.Edit, [View]=RD.[View], [Delete]=RD.[Delete],[Post]=RD.[Post], [Approval]=RD.Approval FROM RoleDetail RD 
          INNER JOIN [UserRoles] UR ON UR.RoleID = RD.RoleID
          WHERE UR.UserID=:UserID`;

      let RoleDetail = await db.sequelize.query(sqlQuery, {
        replacements: { UserID: user.UserID },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      RoleDetail = JSON.stringify(RoleDetail)
      RoleDetail = JSON.parse(RoleDetail)

      response.Roles = RoleDetail;

      res.status(200).send(response);
    } else {
      res.status(401).send("Invalid User / Password!");
    }
  } catch (ex) {
    console.log(ex);
    ResponseLog.Error200(req, res, ex.message);
  }
};

const authenticatePassword = (userPass, reqPass) => {
  const secretKey = AppConfig.SKey;
  const decryptedUserPass = Decrypter.decrypt(userPass, secretKey);
  const decryptedReqPass = Decrypter.decrypt(reqPass, secretKey);
  if (decryptedUserPass === decryptedReqPass) {
    return true;
  }
  // return false;
};
