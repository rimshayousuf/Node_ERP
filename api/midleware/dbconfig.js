// const Master = require("../models/index");
// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const basename = path.basename(__filename);
// // const db = {};
// module.exports = async (req, res, next) => {
//   let Comp = await Master.Company.findOne({where:{DB_Name: req.headers.compcode}});



//   Comp = JSON.stringify(Comp);
//   Comp = JSON.parse(Comp);
  
//   let Server = Comp.DB_Server.split(",");
//   let config = {
//     username: Comp.DB_User,
//     password: Comp.DB_Pass,
//     database: Comp.DB_Name,
//     Seg1: Comp.Seg1,
//     Seg2: Comp.Seg2,
//     Seg3: Comp.Seg3,
//     SegSize1: Comp.SegSize1,
//     SegSize2: Comp.SegSize2,
//     SegSize3: Comp.SegSize3,
//     Segments: Comp.Segments,
//     DefaultCurID: Comp.DefaultCurID,
//     DefaultCurCode: Comp.DefaultCurCode,
//     DefaultCurDesc: Comp.DefaultCurDesc,
//     DefaultCurSymbol: Comp.DefaultCurSymbol,
//     host: Server[0],
//     port: Server[1] || "1433",
//     dialect: "mssql",
//     pool: {
//       max: 1,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     logging: true,
//     logQueryParameters: true,
//     dialectOptions: {
//       options: {
//         requestTimeout: 300000,
//         encrypt: true,
//         validateBulkLoadParameters: false,
//       },
//       timeout: 30,
//       useUTC: false,
//       dateStrings: true,
//     },
//     define: {
//       freezeTableName: false,
//       timestamps: true,
//     },
//     timezone: "Asia/Karachi",
//   };

//   db = {
//     Sequelize,
//     sequelize: new Sequelize(config),
//   };

//   fs.readdirSync(__dirname)
//     .filter((file) => {
//       return (
//         file.indexOf(".") !== 0 &&
//         file !== basename &&
//         file.slice(-3) === ".js"
//       );
//     })
//     .forEach((file) => {
//       const model = require(path.join(__dirname, file))(
//         db.sequelize,
//         Sequelize.DataTypes
//       );
//       db[model.name] = model;
//     });

//   Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });

//   db.Sequelize = Sequelize;

//   req['dbconn'] = db;
// };
