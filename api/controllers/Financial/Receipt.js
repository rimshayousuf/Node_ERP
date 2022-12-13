const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require('./PostReceipts');
const con = require("../../../AppConfig")
const GetCodes = require("../../../core/GetCodes");


exports.getList = async (req, res) => {
    try {
        let Columns = ["TransNo", "TransDate", ["CustDesc", "Customer"], ["CurDesc", "Currency"], ["TotalR", "Total"],
            "Description", ["RStatus", "Status"], "Closed", ["PostedBy", "Posted By"]];


        let Receipt = await SeqFunc.getAll(req.dbconn.FIN_Receipts, { where: {}, order: [["createdAt", "DESC"]] }, true, Columns);
        if (Receipt.success) {
            Receipt.Data.rows.map((val) => {
                val.Description = val.RecDesc;
                val.RStatus = val.Status ? "Posted" : "Un-Posted";
                val.TransDate = con.MomentformatDate(val.TransDate)
                val.TotalR = con.currencyFormat(val.TotalAmount)

                val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
                val.PostedBy = val.Status === 1 ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

                return val;
            });
            ResponseLog.Send200(req, res, Receipt.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        let Receipt = await SeqFunc.getOne(
            req.dbconn.FIN_Receipts,
            { where: { TransNo: req.query.TransNo } }
        );

        if (Receipt.success) {
            let CusAccount = await GetCodes.AccountCodes(req, 'Customers', Receipt.Data.CustCode)

            let query = `SELECT S.SaleID,TransNo,TransType = CASE WHEN TransType = 'SI' THEN 'Sales Invoice' ELSE 'Credit Note' END,
            TransDate=FORMAT(TransDate,'dd-MMM-yyyy'),
            TotalAmount,
            AvailAmount = TotalAmount - (Discount + S.AplAmount) + (ISNULL(A.AplAmount,0)),
            TotalAmountR = FORMAT(TotalAmount,'N2'),
            AvailAmountR = FORMAT(TotalAmount - (Discount + S.AplAmount) + (ISNULL(A.AplAmount,0)),'N2'),
            SaleDesc, Discount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.RecID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
            FROM FIN_Sales S
            LEFT OUTER JOIN (SELECT SaleID, RecID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_SalesApp
            WHERE RecID = ` + Receipt.Data.RecID + ` GROUP BY SaleID, RecID) A ON S.SaleID = A.SaleID 
            WHERE CustID = ` + Receipt.Data.CustID + ` AND TransType IN ('SI','SCI','SDI') AND Status = 1
            AND TotalAmount - (Discount + S.AplAmount) > 0 
            UNION ALL
            SELECT S.RecID,TransNo,TransType,
            TransDate=FORMAT(TransDate,'dd-MMM-yyyy'),
            TotalAmount,
            AvailAmount = TotalAmount - (Discount + S.AplAmount) + (ISNULL(A.AplAmount,0)),
            AvailAmountR = FORMAT(TotalAmount - (Discount + S.AplAmount) + (ISNULL(A.AplAmount,0)),'N2'),
            TotalAmountR = FORMAT(TotalAmount,'N2'),
            RecDesc, Discount = ISNULL(AplDisc,0), AplAmount = ISNULL(A.AplAmount,0), Apply = CASE WHEN A.RecID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
            FROM FIN_Receipts S
            LEFT OUTER JOIN (SELECT SaleID, RecID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_SalesApp 
            WHERE RecID = ` + Receipt.Data.RecID + ` GROUP BY SaleID, RecID) A ON S.RecID = A.SaleID 
            WHERE CustID = ` + Receipt.Data.CustID + ` AND TransType IN ('Refund') AND Status = 1
            AND TotalAmount - (Discount + S.AplAmount) > 0`

            let SalesApp = await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

            Receipt.Data['RecAcctCode'] = CusAccount.Account.RecAcctCode;
            Receipt.Data['RecAcctDesc'] = CusAccount.Account.RecAcctDesc;

            Receipt.Data['SaleAcctCode'] = CusAccount.Account.SaleAcctCode;
            Receipt.Data['SaleAcctDesc'] = CusAccount.Account.SaleAcctDesc;

            Receipt.Data['DiscAcctCode'] = CusAccount.Account.DiscAcctCode;
            Receipt.Data['DiscAcctDesc'] = CusAccount.Account.DiscAcctDesc;

            Receipt.Data['FrgtAcctCode'] = CusAccount.Account.FrgtAcctCode;
            Receipt.Data['FrgtAcctDesc'] = CusAccount.Account.FrgtAcctDesc;


            let Data = {
                Header: Receipt.Data,
                Detail: SalesApp
            }
            ResponseLog.Send200(req, res, Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }

    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let Receipt = await SeqFunc.getOne(
            req.dbconn.FIN_Receipts,
            { where: { TransNo: req.query.TransNo, Closed: 0 } }
        );
        if (Receipt.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_Receipts,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_ReceiptTaxes,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_SalesApp,
                { where: { RecID: Receipt.Data.RecID } }
            );

            ResponseLog.Delete200(req, res);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }

    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.CreateOrUpdate = async (req, res) => {
    const t = await req.dbconn.sequelize.transaction();
    try {
        let Header = req.body.Header;
        let Detail = req.body.Detail;
        Header.CreatedUser = req.headers.username;
        Header.ModifyUser = req.headers.username;

        let ReceiptData = await SeqFunc.Trans_updateOrCreate(
            req.dbconn,
            req.dbconn.FIN_Receipts,
            req.dbconn.FIN_NextNo,
            {
                where: { TransNo: Header.TransNo ? Header.TransNo : "" },
                transaction: t,
            },
            Header,
            t
        );

        if (ReceiptData.success) {

            await SeqFunc.Delete(req.dbconn.FIN_SalesApp, { where: { RecID: ReceiptData.Data.RecID }, transaction: t });


            Promise.all(
                Detail.map(async (o) => {
                    o.RecID = ReceiptData.Data.RecID
                    o.RecType = 'Receipt'
                    o.SaleType = o.TransType
                    return o;
                }))

            let DetailData = await req.dbconn.FIN_SalesApp.bulkCreate(Detail, { transaction: t })


            if (DetailData) {
                await t.commit();
                if (Header.Status) {
                    req.body.Header['TransNo'] = ReceiptData.Data.TransNo
                    Post.postData(req, res)
                } else {
                    if (ReceiptData.created) {
                        ResponseLog.Create200(req, res);
                    } else {
                        ResponseLog.Update200(req, res);
                    }
                }

            } else {
                t.rollback();
                ResponseLog.Error200(req, res, "Error Saving Record!");
            }
        } else {
            t.rollback();
            ResponseLog.Error200(req, res, "Error Saving Record!");
        }
    } catch (err) {
        t.rollback();
        console.log(err)
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.postingData = async (req, res) => {
    try {
        Post.postData(req, res)
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
