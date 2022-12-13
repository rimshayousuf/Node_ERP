const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Manufacturing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Routing":
      controller.LookUp.getRouting(req, res);
      break;
    case "BOM":
      controller.LookUp.getBOM(req, res);
      break;
    case "ActiveBOM":
      controller.LookUp.getActiveBOM(req, res);
      break;
    case "RoutingStages":
      controller.LookUp.getRoutingStages(req, res);
      break;
    case "BOMDetail":
      controller.LookUp.getBOMDetail(req, res);
      break;
    case "MODetail":
      controller.LookUp.getMODetail(req, res);
      break;
    case "MOEntry":
      controller.LookUp.getMODetail(req, res);
      break;
    case "ActiveMO":
      controller.LookUp.getActiveMO(req, res);
      break;
      case "MOStages":
        controller.LookUp.getMOStages(req, res);
        break;
      case "MOReceipt":
        controller.LookUp.getMOReceipt(req, res);
        break;
        case "MOReceiptDetail":
          controller.LookUp.getMOReceiptDetail(req, res);
          break;
    default:
      break;
  }
});

module.exports = router;
