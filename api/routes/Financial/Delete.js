const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Financial/index");
const CheckAuth = require("../../midleware/validate-auth");

router.delete("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.query.FormName) {
    case "Cards": controller.Card.delete(req, res); break;
    case "Category": controller.Category.delete(req, res); break;
    case "Source": controller.Source.delete(req, res); break;
    case "PaymentTerm": controller.PaymentTerm.delete(req, res); break;
    case "PaymentMode": controller.PaymentMode.delete(req, res); break;
    case "Currency": controller.Currency.delete(req, res); break;
    case "TaxDetail": controller.TaxDetail.delete(req, res); break;
    case "Bank": controller.Bank.delete(req, res); break;
    case "AgingBucket": controller.AgingBucket.delete(req, res); break;
    case "TaxSchedule": controller.TaxSchedule.delete(req, res); break;
    case "Period": controller.Period.delete(req, res); break;
    case "CodeCombination": controller.CodeCombination.delete(req, res); break;
    case "Budget": controller.Budget.delete(req, res); break;
    case "Job": controller.Job.delete(req, res); break;
    case "ExtendedJobs": controller.ExtendedJobs.delete(req, res); break;
    case "CareOf": controller.CareOf.delete(req, res); break;
    case "Campaigns": controller.Campaigns.delete(req, res); break;
    case "DonorRegistration": controller.DonorRegistration.delete(req, res); break;
    case "DonorReceipts": controller.DonorReceipts.delete(req, res); break;
    case "Seg1": controller.Segment1.delete(req, res); break;
    case "Seg2": controller.Segment2.delete(req, res); break;
    case "Seg3": controller.Segment3.delete(req, res); break;
    case "VendorCategories": controller.VendorCategories.delete(req, res); break;
    case "VendorProfiles": controller.VendorProfiles.delete(req, res); break;
    case "Vendors": controller.Vendor.delete(req, res); break;
    case "LCCode": controller.LCCode.delete(req, res); break;
    case "LCCategories": controller.LCCategories.delete(req, res); break;
    case "CustomerTerritory": controller.CustomerTerritory.delete(req, res); break;
    case "CustomerCategory": controller.CustomerCategory.delete(req, res); break;
    case "CustomerProfile": controller.CustomerProfile.delete(req, res); break;
    case "Customer": controller.Customer.delete(req, res); break;
    case "ShippingMethod": controller.ShippingMethod.delete(req, res); break;
    case "Taxes": controller.Taxes.delete(req, res); break;
    case "Purchases": controller.Purchases.delete(req, res); break;
    case "Payments": controller.Payments.delete(req, res); break;
    case "Sales": controller.Sales.delete(req, res); break;
    case "Receipt": controller.Receipt.delete(req, res); break;
    case "BankTransfer": controller.BankTransfer.delete(req, res); break;
    case "Journal": controller.Journal.delete(req, res); break;
    case "JournalPayments": controller.JournalPayment.delete(req, res); break;
    case "JournalReceipt": controller.JournalReceipt.delete(req, res); break;
    default: break;
  }
});

module.exports = router;
