const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const JV = require("../../../core/GenerateJV");
const GetCodes = require("../../../core/GetCodes");

exports.postData = async (req, res) => {
    try {
        let TransNo = req.body.Header.TransNo;
        let Header = await req.dbconn.FIN_Sales.findOne({ where: { TransNo } })
        let DetailData = await req.dbconn.FIN_SaleDetail.findAll({ where: { TransNo } })
        let Detail = []

        let CusAccount = await GetCodes.AccountCodes(req, 'Customers', Header.CustCode)

        if (Header.TransType === 'SI') {
            //Discount    
            if (Header.Discount > 0) {
                Detail.push({
                    AcctCode: CusAccount.Account.DiscAcctCode,
                    AcctDesc: CusAccount.Account.DiscAcctDesc,
                    AcctType: 'Discount',
                    LineDr: Header.Discount,
                    LineCr: 0,
                    LineDrCur: Header.DiscountCur,
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
            //Freight
            if (Header.Freight > 0) {
                Detail.push({
                    AcctCode: CusAccount.Account.FrgtAcctCode,
                    AcctDesc: CusAccount.Account.FrgtAcctDesc,
                    AcctType: 'Freight',
                    LineDr: 0,
                    LineCr: Header.Freight,
                    LineDrCur: 0,
                    LineCrCur: Header.FreightCur,
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
        }

        DetailData = DetailData.filter(v => v.AcctCode !== '')
        Promise.all(
            DetailData.map(async v => {
                let Rec = {
                    AcctCode: CusAccount.Account.SaleAcctCode,
                    AcctDesc: CusAccount.Account.SaleAcctDesc,
                    AcctType: 'Sales',
                    LineDr: Header.TransType === 'SCI' ? v.Amount : 0,
                    LineCr: Header.TransType === 'SCI' ? 0 : v.Amount,
                    LineDrCur: Header.TransType === 'SCI' ? v.Amount_Cur : 0,
                    LineCrCur: Header.TransType === 'SCI' ? 0 : v.Amount_Cur,
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
                Detail.push(Rec)
                let Tax = await GetCodes.AccountCodes(req, 'Taxes', v.TaxDetailCode)

                if (v.TaxAmount > 0) {
                    let Item = {
                        AcctCode: Tax.Account.AcctCode,
                        AcctDesc: Tax.Account.AcctDesc,
                        AcctType: 'Taxes',
                        LineDr: Header.TransType === 'SCI' ? v.TaxAmount : 0,
                        LineCr: Header.TransType === 'SCI' ? 0 : v.TaxAmount,
                        LineDrCur: Header.TransType === 'SCI' ? v.TaxAmount_Cur : 0,
                        LineCrCur: Header.TransType === 'SCI' ? 0 : v.TaxAmount_Cur,
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

        Detail.push({
            AcctCode: CusAccount.Account.RecAcctCode,
            AcctDesc: CusAccount.Account.RecAcctDesc,
            AcctType: 'Receivable',
            LineDr: Header.TransType === 'SCI' ? 0 : Header.TotalAmount,
            LineCr: Header.TransType === 'SCI' ? Header.TotalAmount : 0,
            LineDrCur: Header.TransType === 'SCI' ? 0 : Header.TotalAmountCur,
            LineCrCur: Header.TransType === 'SCI' ? Header.TotalAmount : 0,
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

        let JVData = await JV.Create(req, { Header: { Data: Header }, Detail })

        if (JVData.success) {
            await req.dbconn.FIN_Sales.update({
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
