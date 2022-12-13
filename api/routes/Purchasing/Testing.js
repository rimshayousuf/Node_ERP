const express = require('express');
const router = express.Router();
const controller = require("../../controllers/Purchasing/index");

router.post('/', (req, res) => {
    controller.Testing.getOne(req, res)
});

module.exports = router;