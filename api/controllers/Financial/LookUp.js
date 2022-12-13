const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const MaterialData = require("../../../core/MaterialData");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const AppConfig = require("../../../AppConfig");


exports.getJobs = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["JobCode", ["JobDesc", "Job"]];
    let Job = await SeqFunc.LookUp(req.dbconn.FIN_Jobs, { where: { JobHead: 0 } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Job: Job.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getTaxSchedule = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["TaxScheduleCode", "TaxSchedule"];
    let TaxSchedule = await SeqFunc.LookUp(req.dbconn.FIN_TaxSchedule, { where: { IsActive: true } }, true, Columns);

    TaxSchedule?.Data?.rows?.map(v => {
      v.ValueCode = v.TaxScheduleCode + '-' + v.TaxSchedule;
      return v;
    })

    ResponseLog.Send200(req, res, {
      TaxSchedule: TaxSchedule.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getTaxes = async (req, res) => {
  try {
    let TaxColumns = ["TaxDetailID", "TaxDetailCode", "TaxDetail", "TaxType", "AcctCode", "AcctDesc", "TaxRate",
      [req.dbconn.sequelize.literal('0'), "TaxAmount"],
      [req.dbconn.sequelize.literal('0'), "TaxAmount_Cur"]
    ];

    let where = { IsActive: true }

    if (req.query.FormType) {
      where.TaxType =
        { [Op.in]: ['All', req.query.FormType] }
    }

    let Taxes = await req.dbconn.FIN_TaxDetail.findAll({ where: where, attributes: TaxColumns });


    let regColumns = ["TaxDetailCode", "TaxDetail", "TaxType", "TaxRate", "TaxAmount"];
    let Data = await MaterialData.LookUp(Taxes, regColumns);

    ResponseLog.Send200(req, res, {
      TaxDetail: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getPeriodStart = async (req, res) => {
  req.dbconn.FIN_FiscalYear.findAll({
    attributes: ["EndDate"],
    order: [["RID", "DESC"]],
  })
    .then((data) => {
      if (data.length > 0) {
        var newDate = new Date(data[0].EndDate);
        newDate.setDate(newDate.getDate() + 1);
        var Pdate = AppConfig.StringFormatDate(newDate);
        ResponseLog.Send200(req, res, Pdate);

      } else {
        ResponseLog.Send200(req, res, data);
      }
    })
    .catch((err) => {
      ResponseLog.Error200(req, res, err.message);
    });

}

exports.getTaxDetail = async (req, res) => {
  try {
    let Columns = [
      "TaxScheduleID",
      "TaxScheduleCode",
      "TaxSchedule",
      "TaxDetailID",
      "TaxDetail",
      "TaxDetailCode",
      "TaxType",
      "AcctCode",
      "AcctDesc",
      "TaxRate",
      [req.dbconn.sequelize.literal('0'), "TaxAmount"],
      [req.dbconn.sequelize.literal('0'), "TaxAmount_Cur"]
    ];

    let where = { TaxScheduleCode: req.query.TaxScheduleCode }

    if (req.query.Module) {
      where.TaxType =
        { [Op.in]: ['All', req.query.Module] }
    }

    let Taxes = await req.dbconn.FIN_TaxScheduleDetail.findAll({ where: where, attributes: Columns });

    let regColumns = ["TaxDetailCode", "TaxDetail", "TaxType", "TaxRate", "TaxAmount"];
    let Data = await MaterialData.LookUp(Taxes, regColumns);

    ResponseLog.Send200(req, res, {
      TaxDetail: Data,
    });

  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getAccounts = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["AcctCode", "AcctDesc", "AcctType", "Category"];
    let Accounts = await SeqFunc.LookUp(req.dbconn.FIN_CodeCombination, { where: { Enabled: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Accounts: Accounts.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getPayTerms = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["PayTermCode", "PaymentTermsCode"], ["PayTermDesc", "PaymentTerms"]];
    let PayTerms = await SeqFunc.LookUp(req.dbconn.FIN_PayTerms, { where: { IsActive: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      PayTerms: PayTerms.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getSalesPersons = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["CardCode", "SalesPersonCode"], ["CardName", "SalesPerson"]];
    let SalesPersons = await SeqFunc.LookUp(req.dbconn.FIN_Cards, { where: { IsSalesMan: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      SalesPersons: SalesPersons.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCustomers = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["CustomerCode", "Customer"];
    let Customers = await SeqFunc.LookUp(req.dbconn.FIN_Customers, { where: { IsActive: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Customers: Customers.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCurrencies = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["CurCode", "CurName", "CurSymbol"];
    let Currencies = await SeqFunc.LookUp(req.dbconn.FIN_Currencies, {}, true, Columns);

    Currencies?.Data?.rows?.map(v => {
      v.ValueCode = v.CurCode + '-' + v.CurName;
      return v;
    })

    ResponseLog.Send200(req, res, {
      Currencies: Currencies.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getExchangeRate = async (req, res) => {
  try {
    let CurrObject;
    let ExchRates = await req.dbconn.FIN_ExchRates.findAll({
      where: { Tran_CurID: AppConfig.validateintfield(req.query.CurID) },
      order: [["Tran_CurID", "DESC"]]
    })
    ExchRates = JSON.stringify(ExchRates);
    ExchRates = JSON.parse(ExchRates);

    if (AppConfig.validateintfield(req.query.CurID) === 1) {
      CurrObject = {
        Success: true,
        ExchRate: 1,
        Message: "Exchange Rate Found!"
      }
    }
    else {
      for (let i = 0; i < ExchRates.length; i++) {
        let startDate = moment(ExchRates[i].ExchDate)
          , endDate = moment(ExchRates[i].ExpiryDate)
          , date = moment(req.query.TransDate);
        if (date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)) {

          CurrObject = {
            Success: true,
            Message: "Exchange Rate Found!",
            ExchRate: ExchRates[i].ExchRate
          }
          break;
        }
      }
    }
    ResponseLog.Send200(req, res, {
      ExchangeRates: CurrObject?.Success ? CurrObject : {
        Success: false,
        Message: "Exchange Rate Not Found!",
        ExchRate: 0
      },
    });

  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
};

exports.getPeriod = async (req, res) => {
  try {
    let Columns = [];
    let where = {
      Closed: 0,
      [Op.and]: [
        req.dbconn.Sequelize.literal(`'${AppConfig.StringFormatDate(req.query.TransDate)}' BETWEEN StartDate AND EndDate`),
      ],
    }

    Columns = [["PeriodID", "PrdID"], "YearID", "Period"];
    let Period = await req.dbconn.FIN_FiscalPeriod.findOne({ where: where, attributes: Columns });


    Period = JSON.stringify(Period)
    Period = JSON.parse(Period)

    ResponseLog.Send200(req, res, {
      Period: Period ? { PrdID: Period.PrdID, YearID: Period.YearID, Period: Period.Period } : { PrdID: 0, YearID: 0, Period: '' },
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getShippingMethods = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["ShippingMethodCode", "ShippingMethodDesc"];
    let ShippingMethods = await SeqFunc.LookUp(req.dbconn.FIN_ShippingMethods, { where: { IsActive: true } }, true, Columns);

    ResponseLog.Send200(req, res, {
      ShippingMethods: ShippingMethods.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getVendors = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["VendorCode", "Vendor"];
    let Vendors = await SeqFunc.LookUp(req.dbconn.FIN_Vendors, { where: { IsActive: true } }, true, Columns);

    Vendors?.Data?.rows?.map(v => {
      v.ValueCode = v.VendorCode + '-' + v.Vendor;
      return v;
    })

    ResponseLog.Send200(req, res, {
      Vendors: Vendors.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getVendorAddresses = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["VendCode", "Code"], ["Address", "Vendor Address"]];

    let where = req.query.VendID ? { where: { VendID: req.query.VendID } } : {}

    let VendAddress = await SeqFunc.LookUp(req.dbconn.FIN_VendorAddresss, where, true, Columns);

    ResponseLog.Send200(req, res, {
      VendAddress: VendAddress.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getSeg1 = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["VSCode", "SegmentCode"], ["VSDesc", "Segment"]];

    let Seg1 = await SeqFunc.LookUp(req.dbconn.FIN_Seg1, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      Seg1: Seg1.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getSeg2 = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["VSCode", "SegmentCode"], ["VSDesc", "Segment"]];

    let Seg2 = await SeqFunc.LookUp(req.dbconn.FIN_Seg2, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      Seg2: Seg2.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getSeg3 = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["VSCode", "SegmentCode"], ["VSDesc", "Segment"]];

    let Seg3 = await SeqFunc.LookUp(req.dbconn.FIN_Seg3, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      Seg3: Seg3.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getAccountCodes = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["AcctCode", "Code"], ["AcctDesc", "Description"], ["AcctType", "Type"], ["Category", "Category"]];

    // let where = 

    let AcctCodes = await SeqFunc.LookUp(req.dbconn.FIN_CodeCombination, { where: { Enabled: true } }, true, Columns);

    ResponseLog.Send200(req, res, {
      AcctCodes: AcctCodes.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getBudgetYears = async (req, res) => {
  try {

    let BudgetYears = await req.dbconn.FIN_FiscalYear.findAll({
      attributes: ["YearID"],
      include: [{
        model: req.dbconn.FIN_FiscalPeriod,
        // as: "Periods",
        attributes: [["PeriodID", "PrdID"], "Period", "YearID"],
        required: true,
        on: {
          YearID: { [Op.eq]: req.dbconn.Sequelize.col("FIN_FiscalYear.YearID") }
        }
      }]
    })

    ResponseLog.Send200(req, res, {
      BudgetYears: BudgetYears,
    });

  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getAgingBuckets = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["AgBkCode", "Code"], ["AgBkDesc", "Description"]];

    let AgingBuckets = await SeqFunc.LookUp(req.dbconn.FIN_AgingBuckets, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      AgingBuckets: AgingBuckets.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getVendorCategories = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["VendCategoryCode", "Code"], ["VendCategoryDesc", "Description"]];

    let VendorCategories = await SeqFunc.LookUp(req.dbconn.FIN_VendorCategory, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      VendorCategories: VendorCategories.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

// exports.getTaxes = async (req, res) => {
//   try {
//     let Columns = [];

//     Columns = [["TaxCode", "Code"], ["TaxDesc", "Description"]];
//     const where = req.query.TaxType ? { TaxType: req.query.TaxType } : {}

//     let Taxes = await SeqFunc.LookUp(req.dbconn.FIN_TaxDetail, { where: where }, true, Columns);

//     ResponseLog.Send200(req, res, {
//       Taxes: Taxes.Data,
//     });
//   } catch (err) {
//     console.log(err);
//     ResponseLog.Error200(req, res, err.message);
//   }
// };

exports.getCustomerTerritory = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["CustTerCode", "Code"], ["CusTer", "Description"]];

    let CusTer = await SeqFunc.LookUp(req.dbconn.FIN_CustomerTerritories, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      CustomerTerritory: CusTer.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getShippingMethods = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["ShippingMethodCode", "Code"], ["ShippingMethodDesc", "Description"]];

    let ShippingMethods = await SeqFunc.LookUp(req.dbconn.FIN_ShippingMethods, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      ShippingMethod: ShippingMethods.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCustomerCategory = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["CustCatCode", "Code"], ["CustCat", "Description"]];

    let CusCat = await SeqFunc.LookUp(req.dbconn.FIN_CustomerCategories, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      CustomerCategory: CusCat.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCustomerProfiles = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["CPCode", "Code"], ["CP", "Description"]];

    let CustProfile = await SeqFunc.LookUp(req.dbconn.FIN_CustomerProfiles, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      CustorProfiles: CustProfile.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getVendorProfile = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["VendProfileCode", "Code"], ["VendProfileDesc", "Description"]];

    let VendProfile = await SeqFunc.LookUp(req.dbconn.FIN_VendorProfiles, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      VendorProfiles: VendProfile.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getBanks = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["BankCode", "Code"], ["BankName", "Bank Name"], ["BankAC", "Account"]];

    let Banks = await req.dbconn.FIN_Bank.findAll({
      attributes: [
        "BankID",
        [req.dbconn.sequelize.literal("BankCode + '-' + BankName"),"ValueCode"],
        "BankCode",
        "BankName",
        "BankAC",
        "AcctCode",
        "AcctDesc",
        "NextChequeNo"
      ],
      include: [{
        model: req.dbconn.FIN_Currencies,
        as: "Currency",
        required: true,
        attributes: ["CurID", "CurCode", "CurName", ["CurSymbol", "Symbol"], ["CurDecName", "CurDesc"]],
      }]
    })
    let Data = await MaterialData.LookUp(Banks, Columns);

    ResponseLog.Send200(req, res, {
      Banks: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getApplyPurchases = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["TransNo", ["VenRefNo", "Invoice No."], ["TransType", "Trans Type"], ["TransDate", "Trans Date"]];

    let sQuery = `SELECT ID = PayID, TransNo = TransNo, VenRefNo = '', TransDate = PayDate, TransType = 'Payments', TotalAmount = TotalAmount + TaxAmount,
      AplAmount, UnAplAmount = (TotalAmount + TaxAmount) - AplAmount,
      CurID, CurCode, CurDesc
      FROM FIN_Payments 
      WHERE Status = 1 AND (TotalAmount + TaxAmount) - AplAmount <> 0
      AND VendID = ` + req.query.VendID + `
      UNION ALL
      SELECT ID = PurID, TransNo = TransNo, VenRefNo, TransDate = TransDate, TransType, TotalAmount = (TotalAmount + TaxAmount) - Discount,
      AplAmount, UnAplAmount = (TotalAmount + TaxAmount) - (Discount + AplAmount),
      CurID, CurCode, CurDesc
      FROM FIN_Purchases 
      WHERE Status = 1 AND TransType = 'Debit Note' AND (TotalAmount + TaxAmount) - AplAmount <> 0
      AND VendID = ` + req.query.VendID


    let ApplyPurchases = await req.dbconn.sequelize.query(sQuery, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let Data = await MaterialData.LookUp(ApplyPurchases, Columns);

    ResponseLog.Send200(req, res, {
      ApplyPurchases: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getApplyPurchaseDocs = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["TransNo", "Ref No."], ["VenRefNo", "Invoice No."], ["TransType", "Trans Type"], ["TransDate", "Trans Date"]];

    let ApplPString = '';

    if (req.query.TransType === "Payments") {
      ApplPString = `SELECT P.PurID, PurDesc, TransDate, VenRefNo, TransType, TransNo, TotalAmount, AvailAmount = 
          TotalAmount - (DiscAmount + P.AplAmount) + (ISNULL(AplDisc,0) + ISNULL(A.AplAmount,0)), 
          DiscAmount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.PayID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
          FROM FIN_Purchases P
          LEFT OUTER JOIN (SELECT PurID, PayID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_PurApplication
          WHERE PayID = ${req.query.ID} GROUP BY PurID, PayID) A ON P.PurID = A.PurID 
          WHERE P.TransType IN ('POP-Invoice','PI','PCI') AND Status = 1 
          AND TotalAmount - (DiscAmount + P.AplAmount) > 0 
          AND VendID = ${req.query.VendID}`
      //--AND CurID = ${req.query.CurID}`
    }
    else {
      ApplPString = `SELECT P.PurID,TransNo,TransType,TransDate,TotalAmount,AvailAmount = 
      TotalAmount - (DiscAmount + P.AplAmount) + (ISNULL(AplDisc,0) + ISNULL(A.AplAmount,0)),
      PurDesc, DiscAmount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.PayID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
      FROM FIN_Purchases P
      LEFT OUTER JOIN (SELECT PurID, PayID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_PurApplication 
      WHERE PayID = ${req.query.ID} GROUP BY PurID, PayID) A ON P.PurID = A.PurID 
      WHERE P.TransType IN ('PI','PCI') AND Status = 1 
      AND TotalAmount - (DiscAmount + P.AplAmount) > 0 
      AND VendID = ${req.query.VendID}`
      //--AND CurID = ${req.query.CurID}`;
    }

    let ApplyPurchases = await req.dbconn.sequelize.query(ApplPString, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    ResponseLog.Send200(req, res, {
      ApplyPurchases: ApplyPurchases,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
}

exports.getApplySales = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["TransNo", ["TransType", "Trans Type"], ["TransDate", "Trans Date"]];

    let QueryString = `SELECT ID = RecID, TransNo, TransDate = RecDate, TransType, TotalAmount = SubTotal, 
        AplAmount, UnAplAmount = SubTotal - AplAmount 
        FROM FIN_Receipts WHERE Status = 1 AND TransType = 'Receipt' AND SubTotal - AplAmount > 0
        AND CustID = ${req.query.CustID} 
        --AND CurID = ${req.query.CurID}
        UNION ALL
        SELECT ID = SaleID, TransNo = TransNo, TransDate = SaleDate, TransType, TotalAmount = TotalAmount - Discount, 
        AplAmount, UnAplAmount = TotalAmount - (Discount + AplAmount)  
        FROM FIN_Sales WHERE Status = 1 AND TransType = 'Credit Note' AND TotalAmount - (Discount + AplAmount) > 0 
        AND CustID = ${req.query.CustID}`
    //AND CurID = ${req.query.CurID}`


    let ApplySales = await req.dbconn.sequelize.query(QueryString, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let Data = await MaterialData.LookUp(ApplySales, Columns);

    ResponseLog.Send200(req, res, {
      ApplySales: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getApplySalesDocs = async (req, res) => {
  try {
    let ApplString = '';
    if (req.query.TransType === "Receipt") {
      ApplString = `SELECT S.SaleID,TransNo,TransType,SaleDate,TotalAmount,AvailAmount = 
                TotalAmount - (DiscAmount + S.AplAmount) + (ISNULL(AplDisc,0) + ISNULL(A.AplAmount,0)),
                SaleDesc, DiscAmount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.RecID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
                FROM FIN_Sales S
                LEFT OUTER JOIN (SELECT SaleID, RecID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_SalesApp
                WHERE RecID = ` + req.query.RecID + ` GROUP BY SaleID, RecID) A ON S.SaleID = A.SaleID 
                WHERE CustID = ${req.query.CustID} AND TransType IN ('SOP-Invoice','SI','SDI') AND Status = 1
                UNION ALL
                SELECT S.RecID,RecRefNo,TransType,RecDate,TotalAmount,AvailAmount = 
                TotalAmount - (DiscAmount + S.AplAmount) + (ISNULL(AplDisc,0) + ISNULL(A.AplAmount,0)),
                RecDesc, DiscAmount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.RecID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
                FROM FIN_Receipts S
                LEFT OUTER JOIN (SELECT SaleID, RecID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_SalesApp 
                WHERE RecID = ${req.query.RecID} GROUP BY SaleID, RecID) A ON S.RecID = A.SaleID 
                WHERE CustID = ${req.query.CustID} AND TransType IN ('Refund')  AND Status = 1`;
    }
    else {
      ApplString = `SELECT S.SaleID,TransNo,TransType,SaleDate,TotalAmount,AvailAmount = 
                TotalAmount - (DiscAmount + S.AplAmount) + (ISNULL(AplDisc,0) + ISNULL(A.AplAmount,0)),
                SaleDesc, DiscAmount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.RecID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
                FROM FIN_Sales S
                LEFT OUTER JOIN (SELECT SaleID, RecID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_SalesApp
                WHERE RecID = ${req.query.RecID} GROUP BY SaleID, RecID) A ON S.SaleID = A.SaleID 
                WHERE CustID = ${req.query.CustID}  AND TransType IN ('SOP-Invoice','SI','SDI')  AND Status = 1
                UNION ALL
                SELECT S.RecID,RecRefNo,TransType,RecDate,TotalAmount,AvailAmount = 
                TotalAmount - (DiscAmount + S.AplAmount) + (ISNULL(AplDisc,0) + ISNULL(A.AplAmount,0)),
                RecDesc, DiscAmount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.RecID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
                FROM FIN_Receipts S
                LEFT OUTER JOIN (SELECT SaleID, RecID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_SalesApp 
                WHERE RecID = ${req.query.RecID} GROUP BY SaleID, RecID) A ON S.RecID = A.SaleID 
                WHERE CustID = ${req.query.CustID}  AND TransType IN ('Refund')  AND Status = 1`;
    }

    let ApplySales = await req.dbconn.sequelize.query(ApplString, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    ResponseLog.Send200(req, res, {
      ApplySales: ApplySales,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCustomerAddresses = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["CustCode", "Code"], ["Address", "Customer Address"]];

    let where = req.query.CustID ? { where: { CustID: req.query.CustID } } : {}

    let CustAddress = await SeqFunc.LookUp(req.dbconn.FIN_CustomerAddress, where, true, Columns);

    ResponseLog.Send200(req, res, {
      CustAddress: CustAddress.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getBankCodes = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["BankCode", "Bank Code"], ["BankName", "Bank Name"], ["AcctCode", "Acct Code"]];

    let sQuery = `SELECT * FROM FIN_Bank B LEFT OUTER JOIN FIN_Currencies C ON C.CurID = B.CurID`

    let BankCodes = await req.dbconn.sequelize.query(sQuery, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let Data = await MaterialData.LookUp(BankCodes, Columns);

    ResponseLog.Send200(req, res, {
      Banks: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getPaymentModes = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["PayModeCode", "Code"], ["PayModeDesc", "Description"]];

    let PaymentMode = await SeqFunc.LookUp(req.dbconn.FIN_PayModes, { where: {} }, true, Columns);


    PaymentMode?.Data?.rows?.map(v => {
      v.ValueCode = v.PayModeCode + '-' + v.PayModeDesc;
      return v;
    })

    ResponseLog.Send200(req, res, {
      PaymentMode: PaymentMode.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getBatches = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["BatchID", "ID"], ["BatchDesc", "Batch"]];

    let Batches = await SeqFunc.LookUp(req.dbconn.FIN_Batches, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      Batches: Batches.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOpenSales = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["TransNo", "Ref No."], ["TransType", "Trans Type"], ["TransDate", "Trans Date"], ["TotalAmountR", "Total Amount"], ["AvailAmountR", "Due Amount"],
    ["SaleDesc", "Description"], ["Discount", "Discount"], ["AplAmount", "Apply Amount"]];

    let query = `SELECT S.SaleID, TransType = CASE WHEN TransType = 'SI' THEN 'Sales Invoice' ELSE 'Credit Note' END , TransNo, TransDate=FORMAT(TransDate,'dd-MMM-yyyy'), SaleDesc, 
                  TotalAmount, 
                  AvailAmount = TotalAmount - (Discount + ISNULL(SA.AplAmount,0)), 
                  TotalAmountR = FORMAT(TotalAmount,'N2'), 
                  AvailAmountR = FORMAT(TotalAmount - (Discount + ISNULL(SA.AplAmount,0)),'N2'), 
                  Discount = 0, AplAmount = 0, 
                  Apply = CONVERT(bit, 0)  FROM FIN_Sales S
                  LEFT OUTER JOIN (SELECT SaleID, AplAmount = SUM(AplAmount) FROM FIN_SalesApp GROUP BY SaleID) SA ON S.SaleID = SA.SaleID
                  WHERE CustID = ` + req.query.CustID + ` AND TotalAmount - (Discount + ISNULL(SA.AplAmount,0)) > 0 
                  AND TransType IN ('SI','SDI') AND Status = 1
                  UNION ALL
                  SELECT R.RecID, TransType, TransNo, TransDate=FORMAT(TransDate,'dd-MMM-yyyy'), RecDesc, TotalAmount, 
                  AvailAmount = TotalAmount - (Discount + ISNULL(SA.AplAmount,0)), 
                  TotalAmountR = FORMAT(TotalAmount,'N2'), 
                  AvailAmountR = FORMAT(TotalAmount - (Discount + ISNULL(SA.AplAmount,0)),'N2'), 
                  Discount = 0, AplAmount = 0, Apply = CONVERT(bit, 0)  FROM FIN_Receipts R
                  LEFT OUTER JOIN (SELECT RecID, AplAmount = SUM(AplAmount) FROM FIN_SalesApp GROUP BY RecID) SA ON R.RecID = SA.RecID
                  WHERE CustID = ` + req.query.CustID + ` AND TotalAmount - (Discount + ISNULL(SA.AplAmount,0)) > 0 
                  AND TransType IN ('Refund') AND Status = 1`;


    let OpenSales = await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let Data = await MaterialData.LookUp(OpenSales, Columns);

    ResponseLog.Send200(req, res, {
      OpenSales: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOpenPurchases = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["TransNo", "Ref No."], ["VenRefNo", "Invoice No."], ["PurType", "Trans Type"], ["TransDate", "Trans Date"], ["TotalAmountR", "Trans Amount"], ["AvailAmountR", "Due Amount"],
    ["PurDesc", "Description"], ["AplDisc", "Dis Amount"], ["AplAmount", "Apply Amount"]];

    let query = `SELECT 
                  P.PurID, TransNo, TransDate=FORMAT(TransDate,'dd-MMM-yyyy'),VenRefNo, 
                  PurType = CASE WHEN TransType = 'PI' THEN 'Purchase Invoice' ELSE 'Credit Note' END, 
                  P.PurDesc, 
                  AplDisc = Discount,
                  TotalAmount,
                  TotalAmountR = FORMAT(TotalAmount,'N2'), 
                  AvailAmount = TotalAmount - (ISNULL(Discount,0) + ISNULL(PA.AplAmount,0)), 
                  AvailAmountR = FORMAT(TotalAmount - (ISNULL(Discount,0) + ISNULL(PA.AplAmount,0)),'N2'),
                  Discount = 0, 
                  AplAmount = 0,
                  TotalAmountCur, 
                  AvailAmountCur = TotalAmountCur - (ISNULL(DiscountCur,0) + (ISNULL(PA.AplAmount,0) * ExchRate)),
                  DiscAmountCur = 0, 
                  AplAmountCur = 0, 
                  Apply = CONVERT(bit, 0) 
                  FROM FIN_Purchases P
                  LEFT OUTER JOIN (SELECT PurID, AplAmount = SUM(AplAmount) FROM FIN_PurApplication GROUP BY PurID) PA ON P.PurID = PA.PurID
                  WHERE VendID = ` + req.query.VendID + ` AND 
                  TotalAmount - (ISNULL(Discount,0) + ISNULL(PA.AplAmount,0)) > 0 
                  AND TransType IN ('PI','PCI') AND Status = 1`;


    let OpenPurchases = await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

    let Data = await MaterialData.LookUp(OpenPurchases, Columns);

    ResponseLog.Send200(req, res, {
      OpenPurchases: Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getLCCategories = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["CatCode", "Code"], ["CatDesc", "Description"]];

    let LCCat = await SeqFunc.LookUp(req.dbconn.FIN_LCCategories, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      LCCat: LCCat.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getLCCode = async (req, res) => {
  try {
    let Columns = [];

    Columns = [["LCCode", "Code"], ["LCDesc", "Description"]];

    let LCCodes = await SeqFunc.LookUp(req.dbconn.FIN_LCCodes, { where: {} }, true, Columns);

    ResponseLog.Send200(req, res, {
      LCCodes: LCCodes.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getExchangeRateList = async (req, res) => {
  try {
    let Columns = [["Exchange Date", "ExchDate"], ["Expiry Date", "ExpiryDate"], ["Exchange Rate", "ExchRate"]]
    let RespData = await SeqFunc.getAll(req.dbconn.FIN_ExchRates, { where: { Tran_CurID: req.query.Tran_CurID } }, true, Columns);
    if (RespData.success) {
      ResponseLog.Send200(req, res, RespData.Data);
    } else {
      ResponseLog.Send200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCareOf = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["CareOfCode", "CareOf"];
    let CareOf = await SeqFunc.LookUp(req.dbconn.FIN_CareOf, { where: { IsActive: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      CareOf: CareOf.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["CampaignCode", "Campaign"];
    let Campaign = await SeqFunc.LookUp(req.dbconn.FIN_Campaigns, { where: { IsActive: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Campaigns: Campaign.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getDonors = async (req, res) => {
  try {
    let Columns = [];

    Columns = ["DonorCode", "DonorName"];
    let Donor = await SeqFunc.LookUp(req.dbconn.FIN_Donors, { where: { IsActive: true } }, true, Columns);


    ResponseLog.Send200(req, res, {
      Donors: Donor.Data,
    });
  } catch (err) {
    console.log(err);
    ResponseLog.Error200(req, res, err.message);
  }
};