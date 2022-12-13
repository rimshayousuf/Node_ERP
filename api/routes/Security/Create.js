const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Security/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", (req, res) => {
  switch (req.body.FormName) {
    case "Roles":
      controller.Roles.CreateOrUpdate(req, res);
      break;
    case "Users":
      controller.Users.CreateOrUpdate(req, res);
      break;
    case "Company":
      controller.Company.CreateOrUpdate(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
