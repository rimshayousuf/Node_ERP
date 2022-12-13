const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Security/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", (req, res) => {
  switch (req.query.FormName) {
    case "Roles":
      controller.Roles.getOne(req, res);
      break;
    case "Users":
      controller.Users.getOne(req, res);
      break;
    case "Company":
      controller.Company.getOne(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
