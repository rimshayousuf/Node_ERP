const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Sales/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "SalesQuote":
      controller.SalesQuote.postingData(req, res);
      break;
    case "SalesOrder":
      controller.SalesOrder.postingData(req, res);
      break;
    case "SalesDispatch":
      controller.SalesDispatch.postingData(req, res);
      break;
    case "SalesInvoice":
      controller.SalesInvoice.postingData(req, res);
      break;
    case "SalesReturn":
      controller.SalesReturn.postingData(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
