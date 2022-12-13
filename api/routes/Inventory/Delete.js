const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Inventory/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Item":
      controller.Item.delete(req, res);
      break;
    case "Attributes":
      controller.Attributes.delete(req, res);
      break;
    case "ItemClass":
      controller.ItemClass.delete(req, res);
      break;
    case "UOM":
      controller.UOM.delete(req, res);
      break;
    case "Locations":
      controller.Locations.delete(req, res);
      break;
    case "Requisitions":
      controller.Requisitions.delete(req, res);
      break;
    case "Transfers":
      controller.Transfers.delete(req, res);
      break;
    case "Adjustments":
      controller.Adjustments.delete(req, res);
      break;
    case "Receivings":
      controller.Receivings.delete(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
