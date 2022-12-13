const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyparser.json({ limit: "50mb" }));
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "/../build/assets")));
app.use("/img", express.static(path.join(__dirname, "/../build/img")));
app.use("/js", express.static(path.join(__dirname, "/../build/js")));
app.use("/static", express.static(path.join(__dirname, "/../build/static")));

const Auth_LogIn = require("../api/routes/Security/LogIn");
const Auth_Testing = require("../api/routes/Security/Testing");
const Auth_Create = require("../api/routes/Security/Create");
const Auth_Get = require("../api/routes/Security/Get");
const Auth_GetAll = require("../api/routes/Security/GetAll");
const Auth_Delete = require("../api/routes/Security/Delete");
const Auth_LookUp = require("../api/routes/Security/LookUp");

const Man_Testing = require("../api/routes/Manufacturing/Testing");
const Man_Create = require("../api/routes/Manufacturing/Create");
const Man_Get = require("../api/routes/Manufacturing/Get");
const Man_GetAll = require("../api/routes/Manufacturing/GetAll");
const Man_Delete = require("../api/routes/Manufacturing/Delete");
const Man_LookUp = require("../api/routes/Manufacturing/LookUp");
const Man_Post = require("../api/routes/Manufacturing/Post");

const Inv_Testing = require("../api/routes/Inventory/Testing");
const Inv_Create = require("../api/routes/Inventory/Create");
const Inv_Get = require("../api/routes/Inventory/Get");
const Inv_GetAll = require("../api/routes/Inventory/GetAll");
const Inv_Delete = require("../api/routes/Inventory/Delete");
const Inv_LookUp = require("../api/routes/Inventory/LookUp");
const Inv_Post = require("../api/routes/Inventory/Post");

const Pur_Testing = require("../api/routes/Purchasing/Testing");
const Pur_Create = require("../api/routes/Purchasing/Create");
const Pur_Get = require("../api/routes/Purchasing/Get");
const Pur_GetAll = require("../api/routes/Purchasing/GetAll");
const Pur_Delete = require("../api/routes/Purchasing/Delete");
const Pur_LookUp = require("../api/routes/Purchasing/LookUp");
const Pur_Post = require("../api/routes/Purchasing/Post");

const Sales_Testing = require("../api/routes/Sales/Testing");
const Sales_Create = require("../api/routes/Sales/Create");
const Sales_Get = require("../api/routes/Sales/Get");
const Sales_GetAll = require("../api/routes/Sales/GetAll");
const Sales_Delete = require("../api/routes/Sales/Delete");
const Sales_LookUp = require("../api/routes/Sales/LookUp");
const Sales_Post = require("../api/routes/Sales/Post");

const Fin_Create = require("../api/routes/Financial/Create");
const Fin_Get = require("../api/routes/Financial/Get");
const Fin_GetAll = require("../api/routes/Financial/GetAll");
const Fin_Delete = require("../api/routes/Financial/Delete");
const Fin_LookUp = require("../api/routes/Financial/LookUp");
const Fin_Post = require("../api/routes/Financial/Post");


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "build");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, PATCH, OPTIONS HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/v1/Auth/Testing", Auth_Testing);
app.use("/api/v1/Auth/LogIn", Auth_LogIn);
app.use("/api/v1/Auth/Create", Auth_Create);
app.use("/api/v1/Auth/Get", Auth_Get);
app.use("/api/v1/Auth/GetAll", Auth_GetAll);
app.use("/api/v1/Auth/Delete", Auth_Delete);
app.use("/api/v1/Auth/LookUp", Auth_LookUp);

app.use("/api/v1/Manufacturing/Testing", Man_Testing);
app.use("/api/v1/Manufacturing/Create", Man_Create);
app.use("/api/v1/Manufacturing/Get", Man_Get);
app.use("/api/v1/Manufacturing/GetAll", Man_GetAll);
app.use("/api/v1/Manufacturing/Delete", Man_Delete);
app.use("/api/v1/Manufacturing/LookUp", Man_LookUp);
app.use("/api/v1/Manufacturing/Post", Man_Post);

app.use("/api/v1/Inventory/Testing", Inv_Testing);
app.use("/api/v1/Inventory/Create", Inv_Create);
app.use("/api/v1/Inventory/Get", Inv_Get);
app.use("/api/v1/Inventory/GetAll", Inv_GetAll);
app.use("/api/v1/Inventory/Delete", Inv_Delete);
app.use("/api/v1/Inventory/LookUp", Inv_LookUp);
app.use("/api/v1/Inventory/Post", Inv_Post);

app.use("/api/v1/Purchases/Testing", Pur_Testing);
app.use("/api/v1/Purchases/Create", Pur_Create);
app.use("/api/v1/Purchases/Get", Pur_Get);
app.use("/api/v1/Purchases/GetAll", Pur_GetAll);
app.use("/api/v1/Purchases/Delete", Pur_Delete);
app.use("/api/v1/Purchases/LookUp", Pur_LookUp);
app.use("/api/v1/Purchases/Post", Pur_Post);

app.use("/api/v1/Sales/Testing", Sales_Testing);
app.use("/api/v1/Sales/Create", Sales_Create);
app.use("/api/v1/Sales/Get", Sales_Get);
app.use("/api/v1/Sales/GetAll", Sales_GetAll);
app.use("/api/v1/Sales/Delete", Sales_Delete);
app.use("/api/v1/Sales/LookUp", Sales_LookUp);
app.use("/api/v1/Sales/Post", Sales_Post);

app.use("/api/v1/Financials/Create", Fin_Create);
app.use("/api/v1/Financials/Get", Fin_Get);
app.use("/api/v1/Financials/GetAll", Fin_GetAll);
app.use("/api/v1/Financials/Delete", Fin_Delete);
app.use("/api/v1/Financials/LookUp", Fin_LookUp);
app.use("/api/v1/Financials/Post", Fin_Post);

app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../build/index.html"));
});

module.exports = app;
