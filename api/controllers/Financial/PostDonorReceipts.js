const ResponseLog = require("../../../core/ResponseLog");
const JV = require("../../../core/GenerateJV");

exports.postData = async (req, res) => {
    try {
        let TransNo = req.body.Header.TransNo;
        let Header = {};
        let Data = await req.dbconn.FIN_DonorReceipts.findOne({ where: { TransNo } })
        let Detail = [];
        Detail.push({
            AcctCode: Data.RecAcctCode,
            AcctDesc: Data.RecAcctDesc,
            AcctType: 'Donation Income',
            LineDr: 0,
            LineCr: Data.Amount,
            LineDrCur: 0,
            LineCrCur: Data.Amount,
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
            AcctCode: Data.BankAcctCode,
            AcctDesc: Data.BankAcctDesc,
            AcctType: 'Cash',
            LineDr: Data.Amount,
            LineCr: 0,
            LineDrCur: Data.Amount,
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

        Header.Data = Data
        Header.PurDesc = Header.Remarks

        let JVData = await JV.Create(req, { Header, Detail })

        if (JVData.success) {
            await req.dbconn.FIN_DonorReceipts.update({
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
