const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Security/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", (req, res) => {
  switch (req.query.FormName) {
    case "Roles":
      controller.Roles.delete(req, res);
      break;
    case "Users":
      controller.Users.delete(req, res);
      break;
    case "Company":
      controller.Company.delete(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
