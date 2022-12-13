const ResponseLog = require("../../../core/ResponseLog");
const JV = require("../../../core/GenerateJV");
const GetCodes = require("../../../core/GetCodes");

exports.postData = async (req, res) => {
    try {
        let TransNo = req.body.Header.TransNo;
        let Header = await req.dbconn.FIN_Payments.findOne({ where: { TransNo } })
        let Taxes = await req.dbconn.FIN_PaymentTaxes.findAll({ where: { TransNo } })
        let Detail = []

        let VenAccount = await GetCodes.AccountCodes(req, 'Vendors', Header.VendCode)
        let BankAccount = await GetCodes.AccountCodes(req, 'Banks', Header.BankCode)

        //Purchases
        Detail.push({
            AcctCode: VenAccount.Account.PayAcctCode,
            AcctDesc: VenAccount.Account.PayAcctDesc,
            AcctType: 'Payable',
            LineDr: Header.SubTotal,
            LineCr: 0,
            LineDrCur: Header.SubTotalCur,
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
            AcctCode: BankAccount.Account.AcctCode,
            AcctDesc: BankAccount.Account.AcctDesc,
            AcctType: 'Cash',
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

        Promise.all(
            Taxes.map(async v => {

                let Tax = await GetCodes.AccountCodes(req, 'Taxes', v.TaxDetailCode)
                if (v.TaxAmount > 0) {
                    let Item = {
                        AcctCode: Tax.Account.AcctCode,
                        AcctDesc: Tax.Account.AcctDesc,
                        AcctType: 'Taxes',
                        LineDr: 0,
                        LineCr: v.TaxAmount,
                        LineDrCur: 0,
                        LineCrCur: v.TaxAmount_Cur,
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
            await req.dbconn.FIN_Payments.update({
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
