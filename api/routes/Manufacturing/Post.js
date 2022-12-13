const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Manufacturing/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "MO":
      controller.MOEntry.postingData(req, res);
      break;
    case "MOIssuance":
      controller.MOIssuance.postingData(req, res);
      break;
    case "MOReceipt":
      controller.MOReceipt.postingData(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
