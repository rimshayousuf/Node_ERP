const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");



exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo
    let MOI = await SeqFunc.getOne(req.dbconn.MOP_Issuance, { where: { TransNo: TransNo } });


    let Detail = [];

    if (MOI.success) {
      await Stock.Allocation.Allocation(req.dbconn, req.dbconn.MOP_IssuanceDetail, TransNo, MOI.Data.TransDate, 'PCK', MOI.Data.LocationCode, true)
      await Stock.Consumption.Consumption(req, TransNo, res)

      let Stock_Detail = await SeqFunc.getAll(req.dbconn.INV_StockDetail, { where: { TransNo: TransNo } });
      await Promise.all(
        Stock_Detail?.Data?.map(async v => {
          let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)
          Detail.push({
            AcctCode: ItemAccounts.Account.WIP_GLCode,
            AcctDesc: ItemAccounts.Account.WIP_GLCode,
            AcctType: 'Work In Process',
            LineDr: v.QtyOut * v.UnitCost,
            LineCr: 0,
            LineDrCur: v.QtyOut * v.UnitCost,
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
            LineCr: v.QtyOut * v.UnitCost,
            LineDrCur: 0,
            LineCrCur: v.QtyOut * v.UnitCost,
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

        await req.dbconn.MOP_Issuance.update({
          Status: 1,
          Posted: 1,
          PostedUser: req.headers.username,
          postedAt: new Date(),
          JrnlID: JVData.JrnlID
        },
          {
            where: { TransNo: TransNo },
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
