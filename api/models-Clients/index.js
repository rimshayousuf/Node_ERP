"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const Master = require("../models/index");
const db = {};

(async () => {
  try {
    let Comp = await Master.Company.findAll();
    Comp = JSON.stringify(Comp);
    Comp = JSON.parse(Comp);

    Comp.map((val) => {
      let Server = val.DB_Server.split(",");
      let Item = {
        username: val.DB_User,
        password: val.DB_Pass,
        database: val.DB_Name,
        Seg1: val.Seg1,
        Seg2: val.Seg2,
        Seg3: val.Seg3,
        SegSize1: val.SegSize1,
        SegSize2: val.SegSize2, 
        SegSize3: val.SegSize3,
        Segments: val.Segments,
        DefaultCurID: val.DefaultCurID,
        DefaultCurCode : val.DefaultCurCode,
        DefaultCurDesc : val.DefaultCurDesc,
        DefaultCurSymbol : val.DefaultCurSymbol,
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

      db[val["DB_Name"].toString()] = {
        Sequelize,
        sequelize: new Sequelize(Item),
      };

      fs.readdirSync(__dirname)
        .filter((file) => {
          return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
          );
        })
        .forEach((file) => {
          const model = require(path.join(__dirname, file))(
            db[val["DB_Name"]].sequelize,
            Sequelize.DataTypes
          );
          db[val["DB_Name"]][model.name] = model;
        });

      Object.keys(db[val["DB_Name"]]).forEach((modelName) => {
        if (db[val["DB_Name"]][modelName].associate) {
          db[val["DB_Name"]][modelName].associate(db[val["DB_Name"]]);
        }
      });
      db[val["DB_Name"]].Sequelize = Sequelize;
    });
  } catch (err) {
    console.log(err);
  }
})();
module.exports = db;
