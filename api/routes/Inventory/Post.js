const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Inventory/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Requisitions":
      controller.Requisitions.postingData(req, res);
      break;
    case "Transfers":
      controller.Transfers.postingData(req, res);
      break;
    case "Adjustments":
      controller.Adjustments.postingData(req, res);
      break;
    case "Receivings":
      controller.Receivings.postingData(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
