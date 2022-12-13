const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Inventory/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Item":
      controller.Item.getOne(req, res);
      break;
    case "Attributes":
      controller.Attributes.getOne(req, res);
      break;
    case "ItemClass":
      controller.ItemClass.getOne(req, res);
      break;
    case "UOM":
      controller.UOM.getOne(req, res);
      break;
    case "Locations":
      controller.Locations.getOne(req, res);
      break;
    case "Requisitions":
      controller.Requisitions.getOne(req, res);
      break;
    case "Transfers":
      controller.Transfers.getOne(req, res);
      break;
    case "Adjustments":
      controller.Adjustments.getOne(req, res);
      break;
    case "Receivings":
      controller.Receivings.getOne(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
