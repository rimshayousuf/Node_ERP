const jwt = require("jsonwebtoken");
const settings = require("../../AppConfig");
const useragent = require("useragent");
const _ = require("lodash");
const Master = require("../models/index");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename('index.js');
const basepath = path.join(__dirname, '../models-Clients');

useragent(true);


exports.checkAuth = (req, res, next) => {
  const agent = useragent.parse(req.headers["user-agent"]);
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  let verifyvalues = {
    Session: req.headers.session,
    OS: agent.os.toString(),
    WebBrowser: agent.toString(),
    Ver: agent.toVersion(),
    HardWare: agent.device.toString(),
  };

  jwt.verify(token, settings.JWT_KEY, verifyvalues, function (err, response) {
    if (err) {
      res.status(203).json({ message: err.message });
    } else {
      let decoded = jwt.decode(token);

      delete decoded.iat;
      delete decoded.exp;
      if (_.isEqual(decoded, verifyvalues)) {
        req.data = response;
        next();
      } else {
        res
          .status(203)
          .json({ message: "Server Session Expired\\Invalidated!" });
      }
    }
  });
  
};

exports.dbConfig = async (req, res, next) => {
  // console.log({headers:req.headers})
  let Comp = await Master.Company.findOne({where:{DB_Name: req.headers["dbname"]}});
  Comp = JSON.stringify(Comp);
  Comp = JSON.parse(Comp);
  
  let Server = Comp.DB_Server.split(",");
  let config = {
    username: Comp.DB_User,
    password: Comp.DB_Pass,
    database: Comp.DB_Name,
    // Seg1: Comp.Seg1,
    // Seg2: Comp.Seg2,
    // Seg3: Comp.Seg3,
    // SegSize1: Comp.SegSize1,
    // SegSize2: Comp.SegSize2,
    // SegSize3: Comp.SegSize3,
    // Segments: Comp.Segments,
    // DefaultCurID: Comp.DefaultCurID,
    // DefaultCurCode: Comp.DefaultCurCode,
    // DefaultCurDesc: Comp.DefaultCurDesc,
    // DefaultCurSymbol: Comp.DefaultCurSymbol,
    host: Server[0],
    port: Server[1] || "1433",
    dialect: "mssql",
    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true,
    logQueryParameters: true,
    dialectOptions: {
      options: {
        requestTimeout: 300000,
        encrypt: true,
        validateBulkLoadParameters: false,
      },
      timeout: 30,
      useUTC: false,
      dateStrings: true,
    },
    define: {
      freezeTableName: false,
      timestamps: true,
    },
    timezone: "Asia/Karachi",
  };

  db = {
    Sequelize,
    sequelize: new Sequelize(config),
  };


  fs.readdirSync(basepath)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const model = require(path.join(basepath,file))(
        db.sequelize,
        Sequelize.DataTypes
      );
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.Sequelize = Sequelize;

  // await db.sequelize.sync({force:false})

  req['dbconn'] = db;
  // req.data = response;
  next();
};
