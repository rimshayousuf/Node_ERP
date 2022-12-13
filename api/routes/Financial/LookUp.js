const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Financial/index");
const CheckAuth = require("../../midleware/validate-auth");

router.get("/", [CheckAuth.checkAuth, CheckAuth.dbConfig], (req, res) => {
  console.log({ FormName: req.query.FormName })
  switch (req.query.FormName) {
    case "ValidatePeriod":
      controller.LookUp.getPeriod(req, res);
      break;
    case "Jobs":
      controller.LookUp.getJobs(req, res);
      break;
    case "TaxSchedule":
      controller.LookUp.getTaxSchedule(req, res);
      break;
    case "TaxDetail":
      controller.LookUp.getTaxDetail(req, res);
      break;
    case "Taxes":
      controller.LookUp.getTaxes(req, res);
      break;
    case "Accounts":
      controller.LookUp.getAccounts(req, res);
      break;
    case "PayTerms":
      controller.LookUp.getPayTerms(req, res);
      break;
    case "SalesPersons":
      controller.LookUp.getSalesPersons(req, res);
      break;
    case "Customers":
      controller.LookUp.getCustomers(req, res);
      break;
    case "Currencies":
      controller.LookUp.getCurrencies(req, res);
      break;
    case "ExchangeRates":
      controller.LookUp.getExchangeRate(req, res);
      break;
    case "ShippingMethods":
      controller.LookUp.getShippingMethods(req, res);
      break;
    case "Vendors":
      controller.LookUp.getVendors(req, res);
      break;
    case "Seg1":
      controller.LookUp.getSeg1(req, res);
      break;
    case "Seg2":
      controller.LookUp.getSeg2(req, res);
      break;
    case "Seg3":
      controller.LookUp.getSeg3(req, res);
      break;
    case "AccountCodes":
      controller.LookUp.getAccountCodes(req, res);
      break;
    case "BudgetYears":
      controller.LookUp.getBudgetYears(req, res);
      break;
    case "VendorCategories":
      controller.LookUp.getVendorCategories(req, res);
      break;
    case "AgingBuckets":
      controller.LookUp.getAgingBuckets(req, res);
      break;
    case "TaxesLookup":
      controller.LookUp.getTaxes(req, res);
      break;
    case "ShippingMethods":
      controller.LookUp.getShippingMethods(req, res);
      break;
    case "CustomerTerritories":
      controller.LookUp.getCustomerTerritory(req, res);
      break;
    case "CustomerCategories":
      controller.LookUp.getCustomerCategory(req, res);
      break;
    case "CustomerProfiles":
      controller.LookUp.getCustomerProfiles(req, res);
      break;
    case "VendorProfiles":
      controller.LookUp.getVendorProfile(req, res);
      break;
    case "ApplyPurchases":
      controller.LookUp.getApplyPurchases(req, res);
      break;
    case "ApplySales":
      controller.LookUp.getApplySales(req, res);
      break;
    case "ApplySalesDocs":
      controller.LookUp.getApplySalesDocs(req, res);
      break;
    case "ApplyPurchasesDocs":
      controller.LookUp.getApplyPurchaseDocs(req, res);
      break;
    case "Banks":
      controller.LookUp.getBanks(req, res);
      break;
    case "CustomerAddresses":
      controller.LookUp.getCustomerAddresses(req, res);
      break;
    case "BankCodes":
      controller.LookUp.getBankCodes(req, res);
      break;
    case "PaymentModes":
      controller.LookUp.getPaymentModes(req, res);
      break;
    case "Batches":
      controller.LookUp.getBatches(req, res);
      break;
    case "OpenSales":
      controller.LookUp.getOpenSales(req, res);
      break;
    case "OpenPurchases":
      controller.LookUp.getOpenPurchases(req, res);
      break;
    case "VendorAddresses":
      controller.LookUp.getVendorAddresses(req, res);
      break;
    case "LCCategories":
      controller.LookUp.getLCCategories(req, res);
      break;
    case "LCCodes":
      controller.LookUp.getLCCode(req, res);
      break;
    case "ExchangeRate":
      controller.LookUp.getExchangeRateList(req, res);
      break;
    case "PeriodStart":
      controller.LookUp.getPeriodStart(req, res);
      break;
    case "CareOf":
      controller.LookUp.getCareOf(req, res);
      break;
    case "Campaigns":
      controller.LookUp.getCampaigns(req, res);
      break;
    case "Donors":
      controller.LookUp.getDonors(req, res);
      break;
    default:
      break;
  }
});

module.exports = router;
