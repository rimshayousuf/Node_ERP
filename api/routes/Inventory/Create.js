const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Inventory/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {

  switch (req.body.FormName) {
    case "Item":
      controller.Item.CreateOrUpdate(req, res);
      break;
    case "Attributes":
      controller.Attributes.CreateOrUpdate(req, res);
      break;
    case "ItemClass":
      controller.ItemClass.CreateOrUpdate(req, res);
      break;
    case "UOM":
      controller.UOM.CreateOrUpdate(req, res);
      break;
    case "Locations":
      controller.Locations.CreateOrUpdate(req, res);
      break;
    case "Requisitions":
      controller.Requisitions.CreateOrUpdate(req, res);
      break;
    case "Transfers":
      controller.Transfers.CreateOrUpdate(req, res);
      break;
    case "Adjustments":
      controller.Adjustments.CreateOrUpdate(req, res);
      break;
    case "Receivings":
      controller.Receivings.CreateOrUpdate(req, res);
      break;
      case "ItemAssignment":
        controller.ItemAssign.CreateOrUpdate(req, res);
        break;
    default:
      break;
  }
});

module.exports = router;
