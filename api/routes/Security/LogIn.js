const express = require('express');
const router = express.Router();
const controller = require("../../controllers/Security/index");

router.post('/', (req, res) => {
    controller.LogIn.getOne(req, res)
});

module.exports = router;