const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Manufacturing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.body.FormName) {
    case "Machine":
      controller.Machines.CreateOrUpdate(req, res);
      break;
    case "Stages":
      controller.Stages.CreateOrUpdate(req, res);
      break;
    case "Routing":
      controller.Routing.CreateOrUpdate(req, res);
      break;
    case "Shift":
      controller.Shift.CreateOrUpdate(req, res);
      break;
    case "BOM":
      controller.BOM.CreateOrUpdate(req, res);
      break;
    case "MO":
      controller.MOEntry.CreateOrUpdate(req, res);
      break;
    case "MOIssuance":
      controller.MOIssuance.CreateOrUpdate(req, res);
      break;
    case "MOReceipt":
      controller.MOReceipt.CreateOrUpdate(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
