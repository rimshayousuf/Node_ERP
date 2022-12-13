const ResponseLog = require("../../../core/ResponseLog");
const JV = require("../../../core/GenerateJV");
const GetCodes = require("../../../core/GetCodes");

exports.postData = async (req, res) => {
    try {
        let TransNo = req.body.Header.TransNo;
        let Header = await req.dbconn.FIN_Receipts.findOne({ where: { TransNo } })
        let Taxes = await req.dbconn.FIN_ReceiptTaxes.findAll({ where: { TransNo } })
        let Detail = []

        let CusAccount = await GetCodes.AccountCodes(req, 'Customers', Header.CustCode)
        let BankAccount = await GetCodes.AccountCodes(req, 'Banks', Header.BankCode)

        //Cash
        Detail.push({
            AcctCode: BankAccount.Account.AcctCode,
            AcctDesc: BankAccount.Account.AcctDesc,
            AcctType: 'Cash',
            LineDr: Header.TotalAmount,
            LineCr: 0,
            LineDrCur: Header.TotalAmountCur,
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

        //Receivable
        Detail.push({
            AcctCode: CusAccount.Account.RecAcctCode,
            AcctDesc: CusAccount.Account.RecAcctDesc,
            AcctType: 'Receivable',
            LineDr: 0,
            LineCr: Header.SubTotal,
            LineDrCur: 0,
            LineCrCur: Header.SubTotalCur,
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



        Promise.all(
            Taxes.map(async v => {

                let Tax = await GetCodes.AccountCodes(req, 'Taxes', v.TaxDetailCode)

                if (v.TaxAmount > 0) {

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
                }
            })
        );


        let JVData = await JV.Create(req, { Header: { Data: Header }, Detail })

        if (JVData.success) {
            await req.dbconn.FIN_Receipts.update({
                Status: 1,
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
    } catch (err) {
        console.log({ err })
        ResponseLog.Error200(req, res, err.message);
    }
};
