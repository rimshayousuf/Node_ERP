

exports.Create = async function (req, Data) {
    try {
        console.log({Data})
        let Header = Data.Header.Data;
        let Detail = Data.Detail;

        let JVHeader = {
            JrnlName: Header?.CheckDocNo ? Header?.CheckDocNo : '',
            JrnlDate: Header.TransDate,
            JrnlDesc: Header.PurDesc,
            CatID: 1,
            CatCode: '001',
            CatDesc: 'Default',
            SrcID: 1,
            SrcCode: '001',
            SrcDesc: 'Auto',
            BankID: Header.BankID ? Header.BankID : 0,
            BankCode: Header.BankID ? Header.BankCode : '',
            BankDesc: Header.BankID ? Header.BankDesc : '',
            BatchID: 0,
            Batch: '',
            JrnlTotDr: 0,
            JrnlTotCr: 0,
            JrnlTotDrCur: 0,
            JrnlTotCrCur: 0,
            CurID: Header.CurID ? Header.CurID : 1,
            CurCode: Header.CurCode ? Header.CurCode : '001',
            CurDesc: Header.CurDesc ? Header.CurDesc : 'Rs.',
            CurSymbol: Header.CurSymbol ? Header.CurSymbol : 'Rs.',
            ExchRate: 1,
            JrnlStatus: 'Posted',
            Status: 1,
            JrnlCreateDate: new Date(),
            TransNo: Header.TransNo,
            TransType: 'JV',
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
            Detail.map(v => {
                v.JrnlID = JV.JrnlID
                return v
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
    catch (ex) {
        console.log(ex)
        return {
            success:false,
            JrnlID: null,
            message: "Error generating Financials!",
            Detail: ex.message
        }
    }
};