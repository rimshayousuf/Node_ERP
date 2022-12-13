const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Purchasing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
    switch (req.query.FormName) {
      case "Requisition":
        controller.Requisition.delete(req, res);
        break;
      case "PurchaseOrder":
        controller.PurchaseOrder.delete(req, res);
        break;
      case "GoodsReceipt":
        controller.GoodsReceipt.delete(req, res);
        break;
      case "PurchaseInvoice":
        controller.PurchaseInvoice.delete(req, res);
        break;
        case "PurchaseReturn":
          controller.PurchaseReturn.delete(req, res);
          break;
      default:
        break;
  }
});

module.exports = router;
