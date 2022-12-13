const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Financial/index");
const CheckAuth = require("../../midleware/validate-auth");
const Config = require("../../midleware/dbconfig");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Cards": controller.Card.getList(req, res); break;
    case "Category": controller.Category.getList(req, res); break;
    case "Source": controller.Source.getList(req, res); break;
    case "PaymentTerm": controller.PaymentTerm.getList(req, res); break;
    case "PaymentMode": controller.PaymentMode.getList(req, res); break;
    case "Currency": controller.Currency.getList(req, res); break;
    case "TaxDetail": controller.TaxDetail.getList(req, res); break;
    case "Bank": controller.Bank.getList(req, res); break;
    case "AgingBucket": controller.AgingBucket.getList(req, res); break;
    case "TaxSchedule": controller.TaxSchedule.getList(req, res); break;
    case "Period": controller.Period.getList(req, res); break;
    case "CodeCombination": controller.CodeCombination.getList(req, res); break;
    case "Budget": controller.Budget.getList(req, res); break;
    case "Job": controller.Job.getList(req, res); break;
    case "ExtendedJobs": controller.ExtendedJobs.getList(req, res); break;
    case "CareOf": controller.CareOf.getList(req, res); break;
    case "DonorRegistration": controller.DonorRegistration.getList(req, res); break;
    case "DonorReceipts": controller.DonorReceipts.getList(req, res); break;
    case "Campaigns": controller.Campaigns.getList(req, res); break;
    case "Seg1": controller.Segment1.getList(req, res); break;
    case "Seg2": controller.Segment2.getList(req, res); break;
    case "Seg3": controller.Segment3.getList(req, res); break;
    case "VendorCategories": controller.VendorCategories.getList(req, res); break;
    case "VendorProfiles": controller.VendorProfiles.getList(req, res); break;
    case "Vendors": controller.Vendor.getList(req, res); break;
    case "LCCode": controller.LCCode.getList(req, res); break;
    case "LCCategories": controller.LCCategories.getList(req, res); break;
    case "CustomerTerritory": controller.CustomerTerritory.getList(req, res); break;
    case "CustomerCategory": controller.CustomerCategory.getList(req, res); break;
    case "CustomerProfile": controller.CustomerProfile.getList(req, res); break;
    case "Customer": controller.Customer.getList(req, res); break;
    case "ShippingMethod": controller.ShippingMethod.getList(req, res); break;
    case "Taxes": controller.Taxes.getList(req, res); break;
    case "Purchases": controller.Purchases.getList(req, res); break;
    case "Payments": controller.Payments.getList(req, res); break;
    case "Sales": controller.Sales.getList(req, res); break;
    case "Receipt": controller.Receipt.getList(req, res); break;
    case "BankTransfer": controller.BankTransfer.getList(req, res); break;
    case "Journal": controller.Journal.getList(req, res); break;
    case "JournalPayments": controller.JournalPayment.getList(req, res); break;
    case "JournalReceipt": controller.JournalReceipt.getList(req, res); break;
    default: break;
  }
});

module.exports = router;
