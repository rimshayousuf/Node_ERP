const ResponseLog = require("../../../core/ResponseLog");
const JV = require("../../../core/GenerateJV");
const GetCodes = require("../../../core/GetCodes");

exports.postData = async (req, res) => {
    try {
        let TransNo = req.body.Header.TransNo;

        let Header = await req.dbconn.FIN_BankTransfer.findOne({ where: { TransNo } })
        let Detail = [];

        let JVHeader = {
            JrnlName: Header.BTrfDesc,
            JrnlDate: Header.BTrfDate,
            JrnlDesc: Header.BTrfDesc,
            CatID: 1,
            CatCode: '001',
            CatDesc: 'Default',
            SrcID: 1,
            SrcCode: '001',
            SrcDesc: 'Auto',
            BankID: Header.SrcBankID ? Header.SrcBankID : 0,
            BankCode: Header.SrcBankID ? Header.SrcBankCode : '',
            BankDesc: Header.SrcBankID ? Header.SrcBankDesc : '',
            BatchID: 0,
            Batch: '',
            JrnlTotDr: Header.DstBTrfAmount,
            JrnlTotCr: Header.SrcBTrfAmount,
            JrnlTotDrCur: Header.DstBTrfAmount,
            JrnlTotCrCur: Header.SrcBTrfAmount,
            CurID: Header.SrcCurID,
            CurCode: Header.SrcCurCode,
            CurDesc: Header.SrcCurDesc,
            CurSymbol: Header.SrcCurSymbol,
            ExchRate: Header.SrcExchRate,
            JrnlStatus: 'Posted',
            Status: 1,
            JrnlCreateDate: new Date(),
            TransNo: Header.TransNo,
            JrnlNo: Header.TransNo,
            TransType: Header.TransType,
            CardID: 0,
            CardCode: '',
            CardDesc: '',
            TaxInc: 0,
            JrnlTaxDr: 0,
            JrnlTaxCr: 0,
            JrnlTaxDrCur: 0,
            JrnlTaxCrCur: 0,
            JType: 'JV',
            ChkRV: 0,
            BranchCode: null,
            PrdID: Header.PrdID,
            YearID: Header.YearID,
            Period: Header.Period,
            CheckDocNo: Header.CheckDocNo ? Header.CheckDocNo : null,
            CreatedUser: Header.CreatedUser,
            PostedUser: req.headers.username,
            ModifyUser: Header.ModifyUser,
            postedAt: new Date(),
        }
    
        let JV = await req.dbconn.FIN_Journals.create(JVHeader)
    
        if (JV) {
                Detail.push({
                    JrnlID: JV.JrnlID,
                    AcctCode: Header.DstAcctCode,
                    AcctDesc: Header.DstAcctDesc,
                    AcctType: 'Cash',
                    LineDr: Header.DstBTrfAmount,
                    LineCr: 0,
                    LineDrCur: Header.DstBTrfAmount,
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
                    JrnlID: JV.JrnlID,
                    AcctCode: Header.SrcAcctCode,
                    AcctDesc: Header.SrcAcctDesc,
                    AcctType: 'Cash',
                    LineDr: 0,
                    LineCr: Header.SrcBTrfAmount,
                    LineDrCur: 0,
                    LineCrCur: Header.SrcBTrfAmount,
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
    
            let JVData = await req.dbconn.FIN_Lines.bulkCreate(Detail)
    
            let query = `UPDATE J SET JrnlTotDr = TotalDr, JrnlTotCr = TotalCr, JrnlTotDrCur = TotalDrCur, JrnlTotCrCur = TotalCrCur FROM FIN_Journals J
            INNER JOIN (SELECT JrnlID, TotalDr = SUM(LineDr),TotalCr=SUM(LineCr),TotalDrCur = SUM(LineDrCur),TotalCrCur=SUM(LineCrCur) FROM FIN_Lines GROUP BY JrnlID) L ON J.JrnlID = L.JrnlID
            WHERE J.JrnlID = ${JV.JrnlID}`
    
            await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })
                console.log({JVData})
            if (JVData) {
                await req.dbconn.FIN_BankTransfer.update({
                    Status: 1,
                    SrcJrnlID: JV.JrnlID,
                    DstJrnlID: JV.JrnlID,
                    PostedUser: req.headers.username,
                    postedAt: new Date(),
                    JrnlID: JVData.JrnlID
                },
                    {
                        where: { TransNo },
                    })
                ResponseLog.Send200(req, res, "Record Posted Successfully");
            } else {
    
                ResponseLog.Error200(req, res, "Error Posting Record!");
            }
        }
        else {
            return {
                success:false,
                JrnlID: null,
                message: "Error generating Financials!"
            }
        }






        
    } catch (err) {
        console.log({ err })
        ResponseLog.Error200(req, res, err.message);
    }
};

const generatePV = async (Header) => {
    try {

        let JVHeader = {
            JrnlName: Header.CheckDocNo ? Header.CheckDocNo : '',
            JrnlDate: Header.BTrfDate,
            JrnlDesc: Header.BTrfDesc,
            CatID: 1,
            CatCode: '001',
            CatDesc: 'Default',
            SrcID: 1,
            SrcCode: '001',
            SrcDesc: 'Auto',
            BankID: Header.SrcBankID ? Header.SrcBankID : 0,
            BankCode: Header.SrcBankID ? Header.SrcBankCode : '',
            BankDesc: Header.SrcBankID ? Header.SrcBankDesc : '',
            BatchID: 0,
            Batch: '',
            JrnlTotDr: Header.BTrfAmount,
            JrnlTotCr: Header.BTrfAmount,
            JrnlTotDrCur: Header.BTrfAmountCur,
            JrnlTotCrCur: Header.BTrfAmountCur,
            CurID: Header.CurID,
            CurCode: Header.CurCode,
            CurDesc: Header.CurDesc,
            CurSymbol: Header.CurSymbol,
            ExchRate: Header.ExchRate,
            JrnlStatus: 'Posted',
            Status: 1,
            JrnlCreateDate: new Date(),
            TransNo: Header.TransNo,
            TransType: Header.TransType,
            CardID: 0,
            CardCode: '',
            CardDesc: '',
            TaxInc: 0,
            JrnlTaxDr: 0,
            JrnlTaxCr: 0,
            JrnlTaxDrCur: 0,
            JrnlTaxCrCur: 0,
            JType: 'PV',
            ChkRV: 0,
            BranchCode: null,
            PrdID: Header.PrdID,
            YearID: Header.YearID,
            Period: Header.Period,
            CheckDocNo: Header.CheckDocNo ? Header.CheckDocNo : null,
            CreatedUser: Header.CreatedUser,
            PostedUser: req.headers.username,
            ModifyUser: Header.ModifyUser,
            postedAt: new Date(),
        }
    
        let JV = await req.dbconn.FIN_Journals.create(JVHeader)
    
        if (JV) {
                Detail.push({
                    JrnlID: JV.JrnlID,
                    AcctCode: CusAccount.Account.SaleAcctCode,
                    AcctDesc: CusAccount.Account.SaleAcctDesc,
                    AcctType: 'Recon',
                    LineDr: Header.BTrfAmount,
                    LineCr: 0,
                    LineDrCur: Header.BTrfAmountCur,
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
                    JrnlID: JV.JrnlID,
                    AcctCode: Header.SrcAcctCode,
                    AcctDesc: Header.SrcAcctDesc,
                    AcctType: 'Cash',
                    LineDr: 0,
                    LineCr: Header.BTrfAmount,
                    LineDrCur: 0,
                    LineCrCur: Header.BTrfAmountCur,
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
    
            await req.dbconn.FIN_Lines.bulkCreate(Detail)
    
            let query = `UPDATE J SET JrnlTotDr = TotalDr, JrnlTotCr = TotalCr, JrnlTotDrCur = TotalDrCur, JrnlTotCrCur = TotalCrCur FROM FIN_Journals J
            INNER JOIN (SELECT JrnlID, TotalDr = SUM(LineDr),TotalCr=SUM(LineCr),TotalDrCur = SUM(LineDrCur),TotalCrCur=SUM(LineCrCur) FROM FIN_Lines GROUP BY JrnlID) L ON J.JrnlID = L.JrnlID
            WHERE J.JrnlID = ${JV.JrnlID}`
    
            await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })
    
            return {
                success:true,
                JrnlID: JV.JrnlID
            }
        }
        else {
            return {
                success:false,
                JrnlID: null,
                message: "Error generating Financials!"
            }
        }
    }
    catch(err){
        return {
            success:false,
            JrnlID: null,
            message: "Error generating Financials!"
        }
    }



}

const generateRV = async (Header, Detail) => {

    let JVData = await JV.Create(req, { Header, Detail })
}
