const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const GetCodes = require("../../../core/GetCodes");
const JV = require("../../../core/GenerateJV");

exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;

    let Header = await SeqFunc.getOne(
      req.dbconn.POP_InvoiceMaster,
      {
        where: { TransNo: TransNo },
      }
    );

    if (Header.success) {
      
      let VenAccount = await GetCodes.AccountCodes(req, 'Vendors', Header.Data.VendorCode)
      let INV_Detail = await SeqFunc.getAll(req.dbconn.POP_InvoiceDetail, { where: { TransNo: TransNo } });
      
      await AddStock(req.dbconn, INV_Detail?.Data, Header.Data.LocationCode, Header.Data.Location, Header.Data.LCAmount_Cur, Header.Data.TotalAmount_Cur, res)

      let Detail = [];

      let CRAmount = 0
      let CRAmount_Cur = 0

      let InvAmount = 0
      let InvAmount_Cur = 0

      let DRAmount = 0
      let DRAmount_Cur = 0

      await Promise.all(
        INV_Detail?.Data?.map(async v => {
          let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)

          DRAmount += v.SubTotal
          DRAmount_Cur += v.SubTotal_Cur

          CRAmount += v.SubTotal
          CRAmount_Cur += v.SubTotal_Cur

          if (v.GTransNo !== "" && (v.GRPrice !== v.Price)) {

            let Amount = (v.GRPrice - v.Price) * v.BaseQuantity;
            let Amount_Cur = ((v.GRPrice - v.Price) * v.BaseQuantity) * Header.ExchRate;

            Detail.push({
              AcctCode: ItemAccounts.Account.Inventory_GLCode,
              AcctDesc: ItemAccounts.Account.Inventory_GLCode,
              AcctType: 'Inventory',
              LineDr: Amount > 0 ? 0 : Amount,
              LineCr: Amount < 0 ? 0 : Amount,
              LineDrCur: Amount_Cur > 0 ? 0 : Amount_Cur,
              LineCrCur: Amount_Cur < 0 ? 0 : Amount_Cur,
              JobCode: '',
              JobDesc: '',
              TaxCode: '',
              TaxDesc: '',
              LineDesc: '',
              TaxDr: 0.0,
              TaxCr: 0.0,
              TaxDrCur: 0.0,
              TaxCrCur: 0.0,
              TaxLine: 0,
              Recon: 0,
              ReconDate: null,
              LoanID: null,
            })

            InvAmount += Amount;
            InvAmount_Cur += Amount_Cur
          }

          let INV_Taxes = await SeqFunc.getAll(req.dbconn.POP_InvoiceTaxes, { where: { TransNo: TransNo, ItemCode: v.ItemCode, ILineSeq: v.ILineSeq } });
          await Promise.all(
            INV_Taxes?.Data?.map(async v => {

              let Tax = await GetCodes.AccountCodes(req, 'Taxes', v.TaxDetailCode)

              let Item = {
                AcctCode: Tax.Account.AcctCode,
                AcctDesc: Tax.Account.AcctDesc,
                AcctType: 'Taxes',
                LineDr: v.TaxAmount,
                LineCr: 0,
                LineDrCur: v.TaxAmount_Cur,
                LineCrCur: 0,
                JobCode: '',
                JobDesc: '',
                TaxCode: '',
                TaxDesc: '',
                LineDesc: '',
                TaxDr: 0.0,
                TaxCr: 0.0,
                TaxDrCur: 0.0,
                TaxCrCur: 0.0,
                TaxLine: 0,
                Recon: 0,
                ReconDate: null,
                LoanID: null,
              }
              Detail.push(Item)
            })
          );

        })
      )

      //Inventory
      if (InvAmount != 0) {
        if (InvAmount > 0) {
          CRAmount += InvAmount
          CRAmount_Cur += InvAmount_Cur
        }
        else {
          DRAmount += InvAmount
          DRAmount_Cur += InvAmount_Cur
        }
      }

      //Accrued Purchases
      Detail.push({
        AcctCode: VenAccount.Account.AccPurAcctCode,
        AcctDesc: VenAccount.Account.AccPurAcctDesc,
        AcctType: 'Accrued Purchases',
        LineDr: DRAmount,
        LineCr: 0,
        LineDrCur: DRAmount_Cur,
        LineCrCur: 0,
        JobCode: '',
        JobDesc: '',
        TaxCode: '',
        TaxDesc: '',
        LineDesc: '',
        TaxDr: 0.0,
        TaxCr: 0.0,
        TaxDrCur: 0.0,
        TaxCrCur: 0.0,
        TaxLine: 0,
        Recon: 0,
        ReconDate: null,
        LoanID: null,
      })

      //Discount    
      if (Header.Discount > 0) {
        Detail.push({
          AcctCode: VenAccount.Account.DiscAcctCode,
          AcctDesc: VenAccount.Account.DiscAcctDesc,
          AcctType: 'Discount',
          LineDr: 0,
          LineCr: Header.Discount,
          LineDrCur: 0,
          LineCrCur: Header.Discount_Cur,
          JobCode: '',
          JobDesc: '',
          TaxCode: '',
          TaxDesc: '',
          LineDesc: '',
          TaxDr: 0.0,
          TaxCr: 0.0,
          TaxDrCur: 0.0,
          TaxCrCur: 0.0,
          TaxLine: 0,
          Recon: 0,
          ReconDate: null,
          LoanID: null,
        })
      }
      //Freight
      if (Header.Freight > 0) {
        Detail.push({
          AcctCode: VenAccount.Account.FrgtAcctCode,
          AcctDesc: VenAccount.Account.FrgtAcctDesc,
          AcctType: 'Freight',
          LineDr: Header.Freight,
          LineCr: 0,
          LineDrCur: Header.Freight_Cur,
          LineCrCur: 0,
          JobCode: '',
          JobDesc: '',
          TaxCode: '',
          TaxDesc: '',
          LineDesc: '',
          TaxDr: 0.0,
          TaxCr: 0.0,
          TaxDrCur: 0.0,
          TaxCrCur: 0.0,
          TaxLine: 0,
          Recon: 0,
          ReconDate: null,
          LoanID: null,
        })
      }

      //Payable
      Detail.push({
        AcctCode: VenAccount.Account.PayAcctCode,
        AcctDesc: VenAccount.Account.PayAcctDesc,
        AcctType: 'Payable',
        LineDr: 0,
        LineCr: CRAmount,
        LineDrCur: 0,
        LineCrCur: CRAmount_Cur,
        JobCode: '',
        JobDesc: '',
        TaxCode: '',
        TaxDesc: '',
        LineDesc: '',
        TaxDr: 0.0,
        TaxCr: 0.0,
        TaxDrCur: 0.0,
        TaxCrCur: 0.0,
        TaxLine: 0,
        Recon: 0,
        ReconDate: null,
        LoanID: null,
      })

      Detail.sort((a, b) =>  b.LineDr - a.LineDr);


      let JVData = await JV.Create(req, { Header, Detail })

      if (JVData.success) {
        await req.dbconn.POP_InvoiceMaster.update({
          Status: 1,
          Posted: 1,
          PostedUser: req.headers.username,
          postedAt: new Date(),
          JrnlID: JVData.JrnlID
        },
          {
            where: { TransNo },
          })
        ResponseLog.Send200(req, res, "Record Posted Successfully");
      } else {

        ResponseLog.Error200(req, res, "No Record Found!");
      }


    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

const AddStock = async (db, Data, LocationCode, Location, LCAmount, TransTotal, res) => {
  Data = Data.filter(v => v.GTransNo === '')
  Data.map((d) => {
    let ProPrice
    if (LCAmount > 0) {
      let LineAmount = d.Amount
      let ProRate = (LineAmount / TransTotal) * LineAmount
      let ProAmount = ProRate + LineAmount
      ProPrice = ProAmount / d.BaseQuantity
    }
    else {
      ProPrice = d.UnitCost
    }

    d.LocationCode = LocationCode
    d.Location = Location
    d.RecordDate = new Date()
    d.BatchNo = ''
    d.TransType = 'PI' 
    d.ExpiryDate = '01-01-1900'
    d.LineNo = d.ILineSeq
    d.Quantity = d.BaseQuantity
    d.UnitPrice = ProPrice
    d.QtySold = 0
    d.QtyAlloc = 0
    d.Status = 0
    return d
  });
  await db.INV_StockMaster.bulkCreate(Data);
}
