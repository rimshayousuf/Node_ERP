const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Inventory/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Item":
      controller.Item.getList(req, res);
      break;
    case "Attributes":
      controller.Attributes.getList(req, res);
      break;
    case "ItemClass":
      controller.ItemClass.getList(req, res);
      break;
    case "UOM":
      controller.UOM.getList(req, res);
      break;
    case "Locations":
      controller.Locations.getList(req, res);
      break;
    case "Requisitions":
      controller.Requisitions.getList(req, res);
      break;
    case "Transfers":
      controller.Transfers.getList(req, res);
      break;
    case "Adjustments":
      controller.Adjustments.getList(req, res);
      break;
    case "Receivings":
      controller.Receivings.getList(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
