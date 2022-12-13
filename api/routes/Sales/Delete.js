const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Sales/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "SalesQuote":
      controller.SalesQuote.delete(req, res);
      break;
    case "SalesOrder":
      controller.SalesOrder.delete(req, res);
      break;
    case "SalesDispatch":
      controller.SalesDispatch.delete(req, res);
      break;
    case "SalesInvoice":
      controller.SalesInvoice.delete(req, res);
      break;
    case "SalesReturn":
      controller.SalesReturn.delete(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
