const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");


exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;

    let REQ = await SeqFunc.getOne(
      req.dbconn.POP_ReturnMaster,
      {
        where: { TransNo: TransNo },
      }
    );

    if (REQ.success) {
      await Stock.Consumption.Consumption(req, TransNo, res)

      let VenAccount = await GetCodes.AccountCodes(req, 'Vendors', Header.VendorCode)
      let INV_Detail = await SeqFunc.getAll(req.dbconn.POP_ReturnDetail, { where: { TransNo: TransNo } });
      let Detail = [];

      let DRAmount = 0
      let DRAmount_Cur = 0

      await Promise.all(
        INV_Detail?.Data?.map(async v => {
          let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)

          Detail.push({
            AcctCode: ItemAccounts.Account.Inventory_GLCode,
            AcctDesc: ItemAccounts.Account.Inventory_GLCode,
            AcctType: 'Inventory',
            LineDr: 0,
            LineCr: v.Amount,
            LineDrCur: 0,
            LineCrCur: v.Amount_Cur,
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

          DRAmount += v.Amount
          DRAmount_Cur += v.Amount_Cur

          let INV_Taxes = await SeqFunc.getAll(req.dbconn.POP_ReturnTaxes, { where: { TransNo: TransNo, ItemCode: v.ItemCode, RLineSeq: v.RLineSeq } });
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

      //Payable
      Detail.push({
        AcctCode: VenAccount.Account.PayAcctCode,
        AcctDesc: VenAccount.Account.PayAcctDesc,
        AcctType: 'Payable',
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


      Detail.sort((a, b) =>  b.LineDr - a.LineDr);


      let JVData = await JV.Create(req, { Header, Detail })

      if (JVData.success) {
        await req.dbconn.POP_ReturnMaster.update({
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
