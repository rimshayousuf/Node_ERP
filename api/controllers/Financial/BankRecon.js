const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getList = async (req, res) => {
    try {
        let Voucher = []
        Voucher = (req.body.Voucher === 'Unreconciled') ? [0] : (req.body.Voucher === 'Reconciled') ? [1] : [0, 1]

        let BankRecon = await req.dbconn.FIN_Journals.findAll({
            attributes: ['JrnlID', 'JrnlDate', 'TransNo', 'JrnlName', 'CardID', 'CurSymbol'],
            where: { JrnlStatus: 'POSTED', JrnlDate: { [Op.between]: [req.body.FromDate, req.body.ToDate] } },
            order: ['JrnlDate'],
            include: [{
                model: req.dbconn.FIN_Lines,
                attributes: ['LineID', 'LineDesc', 'LineDr', 'LineCr', 'Recon'],
                required: true,
                where: { AcctCode: req.body.BAcctCode, Recon: { [Op.in]: Voucher } },
                as: 'Lines'
            },
            {
                model: req.dbconn.FIN_Cards,
                required: false,
                attributes: ['CardName'],
                as: 'Card'
            }, {
                model: req.dbconn.FIN_Currencies,
                required: true,
                attributes: ['CurID', 'CurName', 'CurSymbol'],
                as: "Currency"
            }]
        })

        const Debit = []
        const Credit = []
        let DrCleared = 0.00
        let CrCleared = 0.00
        let CurSymbol = ''

        BankRecon.map(data => {
            data = JSON.stringify(data);
            let obj = JSON.parse(data);
            Lines = obj.Lines
            CurSymbol = obj.CurSymbol

            Lines.map(line => {
                DrCleared += line.Recon === false ? line.LineDr : 0
                CrCleared += line.Recon === false ? line.LineCr : 0

                if (line.LineDr > 0) {
                    let query = {
                        JrnlID: obj.JrnlID,
                        JrnlDate: obj.JrnlDate,
                        TransNo: obj.TransNo,
                        JrnlName: obj.JrnlName,
                        CardName: obj.CardName = (obj.Card) ? obj.Card.CardName : '',
                        LineID: line.LineID,
                        LineDesc: line.LineDesc,
                        LineDr: CurSymbol + ' ' + line.LineDr,
                        Debit: line.LineDr,
                        Recon: line.Recon,
                        tableData: { checked: line.Recon },
    
                    }
                    Debit.push(query)
                } else {
                    let query = {
                        JrnlID: obj.JrnlID,
                        JrnlDate: obj.JrnlDate,
                        TransNo: obj.TransNo,
                        JrnlName: obj.JrnlName,
                        CardName: obj.CardName = (obj.Card) ? obj.Card.CardName : '',
                        LineID: line.LineID,
                        LineDesc: line.LineDesc,
                        LineCr: CurSymbol + ' ' + line.LineCr,
                        Credit: line.LineCr,
                        Recon: line.Recon,
                        tableData: { checked: line.Recon },
                    }
                    Credit.push(query)
                }
            })
        })

        let query = {
            Deposits: CurSymbol + ' ' + parseFloat(DrCleared),
            Cheques: CurSymbol + ' ' + parseFloat(CrCleared),
        }

        let Jquery = `SELECT GLBal = SUM(LineDr) - SUM(LineCr) FROM FIN_Journals H INNER JOIN FIN_Lines L ON H.JrnlID = L.JrnlID 
        WHERE L.AcctCode = '${req.body.BAcctCode}' AND JrnlStatus = 'POSTED' AND JrnlDate <= '${req.body.ToDate}'`
        
        let jrnl = await req.dbconn.sequelize.query(Jquery, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

        query.GL = CurSymbol + ' ' + parseFloat(jrnl[0].GLBal)

        let response = {}
        response.Debit = Debit
        response.Credit = Credit
        response.Header = query

        let resp = {
            columns: [
                {
                    title: "Code",
                    field: "JrnlID",
                },
                {
                    title: "Description",
                    field: "JrnlDesc",
                },
            ],
            rows: response,
        };

        if (BankRecon) {
            ResponseLog.Send200(req, res, resp);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};


exports.CreateOrUpdate = async (req, res) => {
    try {
        let Header = req.body.Header;

        let BankReconData = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_BankRecon,
            { where: { BRecID: Header.BRecID } },
            Header
        );

        if (BankReconData.success) {
            let Journals = req.body.Debit;
            Array.prototype.push.apply(Journals, req.body.Credit);

            Journals.map(async (val) => {
                const Lines = {
                    Recon: val.Recon,
                    ReconDate: val.Recon === 1 ? new Date() : null
                }

                let query = `UPDATE FIN_Lines SET Recon=${Lines.Recon}, ReconDate=${Lines.ReconDate} 
                    WHERE JrnlID=${val.JrnlID} AND LineID=${val.LineID}`

                let lines = await req.dbconn.sequelize.query(query, {
                    type: req.dbconn.Sequelize.QueryTypes.SELECT,
                });

            })
            ResponseLog.Send200(req, res, "Record Created Successfully");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
