const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");
const GetCodes = require("../../../core/GetCodes");
const JV = require("../../../core/GenerateJV");



exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;
    let Header = await SeqFunc.getOne(req.dbconn.POP_GoodsReceiptMaster, { where: { TransNo: TransNo } });
    let GRN_Detail = await SeqFunc.getAll(req.dbconn.POP_GoodsReceiptDetail, { where: { TransNo: TransNo } });
    let Detail = [];



    if (Header.success) {
      await Stock.Addition.Addition(req.dbconn, req.dbconn.POP_GoodsReceiptDetail, TransNo, Header.Data.LocationCode, Header.Data.Location, Header.Data.TransType, Header.Data.LCAmount_Cur, Header.Data.TotalAmount_Cur, res)
      let VenAccount = await GetCodes.AccountCodes(req, 'Vendors', Header.VendorCode)

      let CRAmount = 0
      let CRAmount_Cur = 0
      await Promise.all(
        GRN_Detail?.Data?.map(async v => {
          CRAmount += v.SubTotal
          CRAmount_Cur += v.SubTotal_Cur
          console.log({v})
          let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)
          Detail.push({
            AcctCode: ItemAccounts?.Account?.Inventory_GLCode,
            AcctDesc: ItemAccounts?.Account?.Inventory_GLCode,
            AcctType: 'Inventory',
            LineDr: v.SubTotal,
            LineCr: 0,
            LineDrCur: v.SubTotal_Cur,
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
        })
      )

      Detail.push({
        AcctCode: VenAccount?.Account?.AccPurAcctCode,
        AcctDesc: VenAccount?.Account?.AccPurAcctDesc,
        AcctType: 'Accrued Purchases',
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
        await req.dbconn.POP_GoodsReceiptMaster.update({
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
