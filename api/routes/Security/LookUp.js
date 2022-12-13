const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Security/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Menu":
      controller.LookUp.getMenu(req, res);
      break;
    case "Roles":
      controller.LookUp.getRoles(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
