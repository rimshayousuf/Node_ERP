const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

const Stock = require("../../../core/Stock");
const GetCodes = require("../../../core/GetCodes");
const JV = require("../../../core/GenerateJV");

exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;
    let REQ = await SeqFunc.getOne(
      req.dbconn.SOP_DispatchMaster,
      {
        where: { TransNo: TransNo },
      }
    );
    let SD_Detail = await SeqFunc.getAll(req.dbconn.SOP_DispatchDetail, { where: { TransNo: TransNo } });
    let Detail = [];


    if (REQ.success) {

      await Stock.Consumption.Consumption(req, TransNo, res)

      await Promise.all(
        SD_Detail?.Data?.map(async v => {

          let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)
          Detail.push({
            AcctCode: ItemAccounts.Account.COGS_GLCode,
            AcctDesc: ItemAccounts.Account.COGS_GLCode,
            AcctType: 'Cost of Goods Sold',
            LineDr: v.Amount,
            LineCr: 0,
            LineDrCur: v.Amount_Cur,
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
        })
      )
      Detail.sort((a, b) => b.LineDr - a.LineDr);

      let JVData = await JV.Create(req, { GRN, Detail })

      if (JVData.success) {
        await req.dbconn.SOP_DispatchMaster.update({
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
      }
    } else {

      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    console.log({ err })
    ResponseLog.Error200(req, res, err.message);
  }
};
