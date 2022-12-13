const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Manufacturing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Machine":
      controller.Machines.delete(req, res);
      break;
    case "Stages":
      controller.Stages.delete(req, res);
      break;
    case "Routing":
      controller.Routing.delete(req, res);
      break;
    case "Shift":
      controller.Shift.delete(req, res);
      break;
    case "BOM":
      controller.BOM.delete(req, res);
      break;
    case "MO":
      controller.MOEntry.delete(req, res);
      break;
    case "MOIssuance":
      controller.MOIssuance.delete(req, res);
      break;
    case "MOReceipt":
      controller.MOReceipt.delete(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
