const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Inventory/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Items":
      controller.LookUp.getItems(req, res);
      break;
    case "FilterItems":
      controller.LookUp.getFilterItems(req, res);
      break;
    case "ItemAssign":
      controller.LookUp.getItemAssign(req, res);
      break;
    case "InventoryItem":
      controller.LookUp.getInventoryItems(req, res);
      break;
    case "ItemUOM":
      controller.LookUp.getItemUOM(req, res);
      break;
    case "Locations":
      controller.LookUp.getLocations(req, res);
      break;
    case "InTransitLocations":
      controller.LookUp.getInTransitLocations(req, res);
      break;
    case "UOMClass":
      controller.LookUp.getUOMClass(req, res);
      break;
    case "UOM":
      controller.LookUp.getUOM(req, res);
      break;
    case "AttributeHeads":
      controller.LookUp.getAttributeHeads(req, res);
      break;
    case "AttributeCodes":
      controller.LookUp.getAttributeCodes(req, res);
      break;
    case "ItemClass":
      controller.LookUp.getItemClass(req, res);
      break;
    case "ItemClassAttributes":
      controller.LookUp.getItemClassAttributes(req, res);
      break;
    case "OpenIRs":
      controller.LookUp.getOpenIRs(req, res);
      break;
    case "OpenTransfers":
      controller.LookUp.getOpenTransfers(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
