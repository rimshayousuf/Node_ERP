const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo
    let REQ = await SeqFunc.getOne(
      req.dbconn.SOP_ReturnMaster,
      {
        where: { TransNo: TransNo },
      }
    );

    if (REQ.success) {



      let CusAccount = await GetCodes.AccountCodes(req, 'Customers', Header.CustomerCode)
      let INV_Detail = await SeqFunc.getAll(req.dbconn.SOP_ReturnDetail, { where: { TransNo: TransNo } });
      let Detail = [];

      await Promise.all(
        INV_Detail?.Data?.map(async v => {
          let INV_Taxes = await SeqFunc.getAll(req.dbconn.SOP_ReturnTaxes, { where: { TransNo: TransNo, ItemCode: v.ItemCode, ILineSeq: v.ILineSeq } });
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

      //Receivable
      Detail.push({
        AcctCode: CusAccount.Account.RecAcctCode,
        AcctDesc: CusAccount.Account.RecAcctDesc,
        AcctType: 'Receivable',
        LineDr: 0,
        LineCr: Header.TotalAmount,
        LineDrCur: 0,
        LineCrCur: Header.TotalAmountCur,
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

      // //Discount    
      // if (Header.Discount > 0) {
      //   Detail.push({
      //     AcctCode: CusAccount.Account.DiscAcctCode,
      //     AcctDesc: CusAccount.Account.DiscAcctDesc,
      //     AcctType: 'Discount',
      //     LineDr: Header.Discount,
      //     LineCr: 0,
      //     LineDrCur: Header.Discount_Cur,
      //     LineCrCur: 0,
      //     JobCode: '',
      //     JobDesc: '',
      //     TaxCode: '',
      //     TaxDesc: '',
      //     LineDesc: '',
      //     TaxDr: 0.0,
      //     TaxCr: 0.0,
      //     TaxDrCur: 0.0,
      //     TaxCrCur: 0.0,
      //     TaxLine: 0,
      //     Recon: 0,
      //     ReconDate: null,
      //     LoanID: null,
      //   })
      // }
      // //Freight
      // if (Header.Freight > 0) {
      //   Detail.push({
      //     AcctCode: CusAccount.Account.FrgtAcctCode,
      //     AcctDesc: CusAccount.Account.FrgtAcctDesc,
      //     AcctType: 'Freight',
      //     LineDr: 0,
      //     LineCr: Header.Freight,
      //     LineDrCur: 0,
      //     LineCrCur: Header.Freight_Cur,
      //     JobCode: '',
      //     JobDesc: '',
      //     TaxCode: '',
      //     TaxDesc: '',
      //     LineDesc: '',
      //     TaxDr: 0.0,
      //     TaxCr: 0.0,
      //     TaxDrCur: 0.0,
      //     TaxCrCur: 0.0,
      //     TaxLine: 0,
      //     Recon: 0,
      //     ReconDate: null,
      //     LoanID: null,
      //   })
      // }

      //Sales
      Detail.push({
        AcctCode: CusAccount.Account.SaleAcctCode,
        AcctDesc: CusAccount.Account.SaleAcctDesc,
        AcctType: 'Sales',
        LineDr: Header.TransTotal,
        LineCr: 0,
        LineDrCur: Header.TransTotal_Cur,
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

      Detail.sort((a, b) => b.LineDr - a.LineDr);

      let JVData = await JV.Create(req, { Header, Detail })

      if (JVData.success) {
        await req.dbconn.SOP_ReturnMaster.update({
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
    console.log({ err })
    ResponseLog.Error200(req, res, err.message);
  }
};
