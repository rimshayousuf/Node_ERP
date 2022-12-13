const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Financial/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Purchases": controller.Purchases.postingData(req, res); break;
    case "Payments": controller.Payments.postingData(req, res); break;
    case "Sales": controller.Sales.postingData(req, res); break;
    case "Receipt": controller.Receipt.postingData(req, res); break;
    case "BankTransfer": controller.BankTransfer.postingData(req, res); break;
    case "Journal": controller.Journal.postingData(req, res); break;
    case "JournalPayments": controller.JournalPayment.postingData(req, res); break;
    case "JournalReceipt": controller.JournalReceipt.postingData(req, res); break;
    case "DonorReceipts": controller.DonorReceipts.postingData(req, res); break;

    default: break;
  }
});

module.exports = router;
