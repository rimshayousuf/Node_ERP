const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Purchasing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig],(req, res) => {
  switch (req.query.FormName) {
    case "Requisition":
      controller.Requisition.getList(req, res);
      break;
    case "PurchaseOrder":
      controller.PurchaseOrder.getList(req, res);
      break;
    case "GoodsReceipt":
      controller.GoodsReceipt.getList(req, res);
      break;
    case "PurchaseInvoice":
      controller.PurchaseInvoice.getList(req, res);
      break;
      case "PurchaseReturn":
        controller.PurchaseReturn.getList(req, res);
        break;
    default:
      break;
  }
});

module.exports = router;
