const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Purchasing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "OpenRequisitions":
      controller.LookUp.OpenRequisitions(req, res);
      break;
    case "OpenPurchaseOrders":
      controller.LookUp.OpenOrders(req, res);
      break;
    case "OpenGoodsReceipt":
      controller.LookUp.OpenGoodsReceipt(req, res);
      break;
      case "ReturnItems":
        controller.LookUp.ReturnItems(req, res);
        break;
    default:
      break;
  }
});

module.exports = router;
