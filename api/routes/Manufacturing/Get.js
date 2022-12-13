const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Manufacturing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Machine":
      controller.Machines.getOne(req, res);
      break;
    case "Stages":
      controller.Stages.getOne(req, res);
      break;
    case "Routing":
      controller.Routing.getOne(req, res);
      break;
    case "Shift":
      controller.Shift.getOne(req, res);
      break;
    case "BOM":
      controller.BOM.getOne(req, res);
      break;
    case "MOEntry":
      controller.MOEntry.getOne(req, res);
      break;
    case "MOIssuance":
      controller.MOIssuance.getOne(req, res);
      break;
    case "MOReceipt":
      controller.MOReceipt.getOne(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
