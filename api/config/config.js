require("dotenv").config();

module.exports = {
  production: {
    username: process.env.dbUser,
    password: process.env.dbPass,
    database: process.env.dbName_master,
    host: process.env.dbHost,
    port: process.env.dbPort,
    dialect: "mssql",
    pool: {
      max: 1, // default connection pool size
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
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
  },
  SBS: {
    username: process.env.dbUser,
    password: process.env.dbPass,
    database: process.env.dbName_SBS,
    host: process.env.dbHost,
    port: process.env.dbPort,
    dialect: "mssql",
    pool: {
      max: 1, // default connection pool size
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
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
  }
};
