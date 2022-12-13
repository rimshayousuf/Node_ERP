const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Financial/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Cards": controller.Card.getOne(req, res); break;
    case "Category": controller.Category.getOne(req, res); break;
    case "Source": controller.Source.getOne(req, res); break;
    case "PaymentTerm": controller.PaymentTerm.getOne(req, res); break;
    case "PaymentMode": controller.PaymentMode.getOne(req, res); break;
    case "Currency": controller.Currency.getOne(req, res); break;
    case "TaxDetail": controller.TaxDetail.getOne(req, res); break;
    case "Bank": controller.Bank.getOne(req, res); break;
    case "AgingBucket": controller.AgingBucket.getOne(req, res); break;
    case "TaxSchedule": controller.TaxSchedule.getOne(req, res); break;
    case "Period": controller.Period.getOne(req, res); break;
    case "CodeCombination": controller.CodeCombination.getOne(req, res); break;
    case "Budget": controller.Budget.getOne(req, res); break;
    case "Job": controller.Job.getOne(req, res); break;
    case "ExtendedJobs": controller.ExtendedJobs.getOne(req, res); break;
    case "CareOf": controller.CareOf.getOne(req, res); break;
    case "DonorRegistration": controller.DonorRegistration.getOne(req, res); break;
    case "DonorReceipts": controller.DonorReceipts.getOne(req, res); break;
    case "Campaigns": controller.Campaigns.getOne(req, res); break;
    case "Seg1": controller.Segment1.getOne(req, res); break;
    case "Seg2": controller.Segment2.getOne(req, res); break;
    case "Seg3": controller.Segment3.getOne(req, res); break;
    case "VendorCategories": controller.VendorCategories.getOne(req, res); break;
    case "VendorProfiles": controller.VendorProfiles.getOne(req, res); break;
    case "Vendors": controller.Vendor.getOne(req, res); break;
    case "LCCode": controller.LCCode.getOne(req, res); break;
    case "LCCategories": controller.LCCategories.getOne(req, res); break;
    case "CustomerTerritory": controller.CustomerTerritory.getOne(req, res); break;
    case "CustomerCategory": controller.CustomerCategory.getOne(req, res); break;
    case "CustomerProfile": controller.CustomerProfile.getOne(req, res); break;
    case "Customer": controller.Customer.getOne(req, res); break;
    case "ShippingMethod": controller.ShippingMethod.getOne(req, res); break;
    case "Taxes": controller.Taxes.getOne(req, res); break;
    case "Purchases": controller.Purchases.getOne(req, res); break;
    case "Payments": controller.Payments.getOne(req, res); break;
    case "Sales": controller.Sales.getOne(req, res); break;
    case "Receipt": controller.Receipt.getOne(req, res); break;
    case "BankTransfer": controller.BankTransfer.getOne(req, res); break;
    case "Journal": controller.Journal.getOne(req, res); break;
    case "JournalPayments": controller.JournalPayment.getOne(req, res); break;
    case "JournalReceipt": controller.JournalReceipt.getOne(req, res); break;
    default: break;
  }
});

module.exports = router;
