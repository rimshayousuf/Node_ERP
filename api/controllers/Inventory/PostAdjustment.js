const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");


exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;
    let REQ = await SeqFunc.getOne( req.dbconn.INV_TransactionHeader,{ where: { TransNo: TransNo } } );
    let ADJ_Detail = await SeqFunc.getAll(req.dbconn.INV_TransactionDetail, { where: { TransNo: TransNo } });
    let Detail = [];

    if (REQ.success) {

      if (REQ.Data.FormType === 'AdjInward'){
        await Stock.Addition.Addition(req.dbconn,req.dbconn.INV_TransactionDetail, TransNo, REQ.Data.LocationCode, REQ.Data.Location, REQ.Data.TransType,0,0, res)
      }
      else {
        await Stock.Consumption.Consumption(req, TransNo, res)
      }

      await Promise.all(
        ADJ_Detail?.Data?.map(async v => {

          let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)
          Detail.push({
            AcctCode: ItemAccounts.Account.Inventory_GLCode,
            AcctDesc: ItemAccounts.Account.Inventory_GLCode,
            AcctType: 'Inventory',
            LineDr: REQ.Data.FormType === 'AdjInward' ? v.Amount : 0,
            LineCr: REQ.Data.FormType === 'AdjInward' ? 0 : v.Amount,
            LineDrCur: REQ.Data.FormType === 'AdjInward' ? v.Amount_Cur : 0,
            LineCrCur: REQ.Data.FormType === 'AdjInward' ? 0 : v.Amount_Cur,
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
          Detail.push({
            AcctCode: ItemAccounts.Account.Expense_GLCode,
            AcctDesc: ItemAccounts.Account.Expense_GLCode,
            AcctType: 'Inventory Offset',
            LineDr: REQ.Data.FormType === 'AdjInward' ? 0 : v.Amount,
            LineCr: REQ.Data.FormType === 'AdjInward' ? v.Amount : 0,
            LineDrCur: REQ.Data.FormType === 'AdjInward' ? 0 : v.Amount_Cur,
            LineCrCur: REQ.Data.FormType === 'AdjInward' ? v.Amount_Cur : 0,
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
        })
      )

      Detail.sort((a, b) =>  b.LineDr - a.LineDr);

      let JVData = await JV.Create(req, { GRN, Detail })

      if (JVData.success) {
        await req.dbconn.INV_TransactionHeader.update({
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
