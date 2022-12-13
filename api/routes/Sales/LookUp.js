const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Sales/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "OpenSalesQuotes":
      controller.LookUp.getOpenSalesQuotes(req, res);
      break;
    case "OpenSalesOrders":
      controller.LookUp.getOpenSalesOrders(req, res);
      break;
    case "OpenSalesDispatches":
      controller.LookUp.getOpenSalesDispatches(req, res);
      break;
      case "OpenReturnItems":
        controller.LookUp.OpenReturnItems(req, res);
        break;
    default:
      break;
  }
});

module.exports = router;
