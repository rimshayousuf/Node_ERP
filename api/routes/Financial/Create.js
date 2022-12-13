const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Financial/index");
const CheckAuth = require("../../midleware/validate-auth");

router.post("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.body.FormName) {
    case "Cards": controller.Card.CreateOrUpdate(req, res); break;
    case "Category": controller.Category.CreateOrUpdate(req, res); break;
    case "Source": controller.Source.CreateOrUpdate(req, res); break;
    case "PaymentTerm": controller.PaymentTerm.CreateOrUpdate(req, res); break;
    case "PaymentMode": controller.PaymentMode.CreateOrUpdate(req, res); break;
    case "Currency": controller.Currency.CreateOrUpdate(req, res); break;
    case "ExchangeRate": controller.Currency.ExchangeRateCreateOrUpdate(req, res); break;
    case "TaxDetail": controller.TaxDetail.CreateOrUpdate(req, res); break;
    case "Bank": controller.Bank.CreateOrUpdate(req, res); break;
    case "AgingBucket": controller.AgingBucket.CreateOrUpdate(req, res); break;
    case "TaxSchedule": controller.TaxSchedule.CreateOrUpdate(req, res); break;
    case "Period": controller.Period.CreateOrUpdate(req, res); break;
    case "CodeCombination": controller.CodeCombination.CreateOrUpdate(req, res); break;
    case "Budget": controller.Budget.CreateOrUpdate(req, res); break;
    case "Job": controller.Job.CreateOrUpdate(req, res); break;
    case "ExtendedJobs": controller.ExtendedJobs.CreateOrUpdate(req, res); break;
    case "CareOf": controller.CareOf.CreateOrUpdate(req, res); break;
    case "Campaigns": controller.Campaigns.CreateOrUpdate(req, res); break;
    case "DonorRegistration": controller.DonorRegistration.CreateOrUpdate(req, res); break;
    case "DonorReceipts": controller.DonorReceipts.CreateOrUpdate(req, res); break;
    case "Seg1": controller.Segment1.CreateOrUpdate(req, res); break;
    case "Seg2": controller.Segment2.CreateOrUpdate(req, res); break;
    case "Seg3": controller.Segment3.CreateOrUpdate(req, res); break;
    case "VendorCategories": controller.VendorCategories.CreateOrUpdate(req, res); break;
    case "VendorProfiles": controller.VendorProfiles.CreateOrUpdate(req, res); break;
    case "Vendors": controller.Vendor.CreateOrUpdate(req, res); break;
    case "LCCode": controller.LCCode.CreateOrUpdate(req, res); break;
    case "LCCategories": controller.LCCategories.CreateOrUpdate(req, res); break;
    case "CustomerTerritory": controller.CustomerTerritory.CreateOrUpdate(req, res); break;
    case "CustomerCategory": controller.CustomerCategory.CreateOrUpdate(req, res); break;
    case "CustomerProfile": controller.CustomerProfile.CreateOrUpdate(req, res); break;
    case "Customer": controller.Customer.CreateOrUpdate(req, res); break;
    case "ShippingMethod": controller.ShippingMethod.CreateOrUpdate(req, res); break;
    case "Taxes": controller.Taxes.CreateOrUpdate(req, res); break;
    case "Purchases": controller.Purchases.CreateOrUpdate(req, res); break;
    case "Payments": controller.Payments.CreateOrUpdate(req, res); break;
    case "Sales": controller.Sales.CreateOrUpdate(req, res); break;
    case "Receipt": controller.Receipt.CreateOrUpdate(req, res); break;
    case "BankTransfer": controller.BankTransfer.CreateOrUpdate(req, res); break;
    case "BankRecon": controller.BankRecon.CreateOrUpdate(req, res); break;
    case "GetBankRecon": controller.BankRecon.getList(req, res); break;
    case "Journal": controller.Journal.CreateOrUpdate(req, res); break;
    case "JournalPayments": controller.JournalPayment.CreateOrUpdate(req, res); break;
    case "JournalReceipt": controller.JournalReceipt.CreateOrUpdate(req, res); break;
    case "ApplyReceivableEntry": controller.ApplyReceivable.CreateOrUpdate(req, res); break;
    case "ApplyPayableEntry": controller.ApplyPayable.CreateOrUpdate(req, res); break;

    default: break;
  }
});

router.put("/:AcctCode", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  switch (req.body.FormName) {
    case "GetBankRecon": controller.BankRecon.getList(req, res); break;
    default: break;
  }
});

module.exports = router;
