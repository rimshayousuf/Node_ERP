const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Purchasing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Requisition":
      controller.Requisition.postingData(req, res);
      break;
    case "PurchaseOrder":
      controller.PurchaseOrder.postingData(req, res);
      break;
    case "GoodsReceipt":
      controller.GoodsReceipt.postingData(req, res);
      break;
    case "PurchaseInvoice":
      controller.PurchaseInvoice.postingData(req, res);
      break;
    case "PurchaseReturn":
      controller.PurchaseReturn.postingData(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
