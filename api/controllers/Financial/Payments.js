const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const MaterialData = require("../../../core/MaterialData");
const Post = require('./PostPayments');
const con = require("../../../AppConfig")
const GetCodes = require("../../../core/GetCodes");


exports.getList = async (req, res) => {
    try {
        let Columns = ["TransNo", "TransDate", ["VendDesc", "Vendor"], ["CurDesc", "Currency"], ["TotalR", "Total"],
            "Description", ["RStatus", "Status"], "Closed", ["PostedBy", "Posted By"]];

        let FIN_Payments = await req.dbconn.FIN_Payments.findAll({ order: [["createdAt", "DESC"]] });

        FIN_Payments = JSON.stringify(FIN_Payments)
        FIN_Payments = JSON.parse(FIN_Payments)
        // if (FIN_Payments.length > 0) {
        FIN_Payments.map((val) => {
            val.Description = val.PayDesc;
            val.RStatus = val.Status ? "Posted" : "Un-Posted";
            val.TransDate = con.MomentformatDate(val.TransDate)
            val.TotalR = con.currencyFormat(val.TotalAmount)

            val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
            val.PostedBy = val.Status === 1 ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

            return val;
        });
        let Data = await MaterialData.Register(FIN_Payments, Columns)
        ResponseLog.Send200(req, res, Data);
        // } else {
        //     ResponseLog.Error200(req, res, "No Record Found!");
        // }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        let Payment = await SeqFunc.getOne(req.dbconn.FIN_Payments, { where: { TransNo: req.query.TransNo } });
        let VenAccount = await GetCodes.AccountCodes(req, 'Vendors', Payment.Data.VendCode)
        if (Payment.success) {

            let query = `SELECT 
                            P.PurID, TransNo, TransDate=FORMAT(TransDate,'dd-MMM-yyyy'), VenRefNo, 
                            PurType = CASE WHEN TransType = 'PI' THEN 'Purchase Invoice' ELSE 'Credit Note' END, 
                            TotalAmount, 
                            TotalAmountR = FORMAT(TotalAmount,'N2'), 
                            AvailAmount = TotalAmount - (P.AplAmount + ISNULL(A.AplAmount,0)),
                            AvailAmountR = FORMAT(TotalAmount - (P.AplAmount + ISNULL(A.AplAmount,0)),'N2'),
                            PurDesc,  
                            AplAmount = ISNULL(A.AplAmount,0), 
                            Apply = CASE WHEN A.PayID IS NOT NULL THEN Convert(BIT, 1) ELSE Convert(BIT, 0) END
                            FROM FIN_Purchases P
                            LEFT OUTER JOIN (SELECT PurID, PayID, AplDisc=SUM(AplDisc), AplAmount = SUM(AplAmount) FROM FIN_PurApplication  
                            WHERE PayID = ${Payment.Data.PayID} GROUP BY PurID, PayID) A ON P.PurID = A.PurID 
                            WHERE P.TransType IN ('PI','SI','PCI') AND VendID = ${Payment.Data.VendID}`

            let PaymentDetail = await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

            Payment.Data['PayAcctCode'] = VenAccount.Account.PayAcctCode;
            Payment.Data['PayAcctDesc'] = VenAccount.Account.PayAcctDesc;

            Payment.Data['OnAccount'] = Payment.Data['TotalAmount'] - Payment.Data['AplAmount'];
            // Payment.Data['OnAccountCur'] = Payment.Data['TotalAmountCur'] - Payment.Data['TotalAmountCur'];

            if (PaymentDetail) {
                let Data = {
                    Header: Payment.Data,
                    Detail: PaymentDetail
                }
                ResponseLog.Send200(req, res, Data);
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

exports.delete = async (req, res) => {
    try {
        let Payments = await SeqFunc.getOne(
            req.dbconn.FIN_Payments,
            { where: { TransNo: req.query.TransNo, Closed: 0 } }
        );

        if (Payments.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_Journals,
                { where: { JrnlID: Payments.Data.JrnlID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: Payments.Data.JrnlID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Payments,
                { where: { PayID: Payments.Data.PayID } }
            );
            let query = `UPDATE P SET P.AplAmount = P.AplAmount - ISNULL(A.AplAmount,0), P.DiscAmount = P.DiscAmount - ISNULL(A.AplDisc,0) 
                FROM FIN_Purchases P
                INNER JOIN (SELECT PurID, AplAmount = SUM(AplAmount), AplDisc = SUM(AplDisc) FROM FIN_PurApplication 
                WHERE PayID = ${Payments.Data.PayID}
                GROUP BY PurID) A ON P.PurID = A.PurID`

            let PaymentDetails = await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

            await SeqFunc.Delete(
                req.dbconn.FIN_PurApplication,
                { where: { PayID: req.query.PayID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_PaymentTaxes,
                { where: { TransNo: req.query.TransNo } }
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
        delete Header.PayID

        let PaymentData = await SeqFunc.Trans_updateOrCreate(
            req.dbconn,
            req.dbconn.FIN_Payments,
            req.dbconn.FIN_NextNo,
            {
                where: { TransNo: Header.TransNo ? Header.TransNo : "" },
                transaction: t,
            },
            Header,
            t
        );

        if (PaymentData.success) {

            await SeqFunc.Delete(req.dbconn.FIN_PurApplication, { where: { PayID: PaymentData.Data.PayID }, transaction: t });

            Promise.all(
                Detail.map(async (o) => {
                    o.PayID = PaymentData.Data.PayID
                    o.PayType = 'Payments'
                    return o;
                })
            )


            let DetailData = await req.dbconn.FIN_PurApplication.bulkCreate(Detail, { transaction: t })
            

            if (DetailData) {
                await t.commit();

                if (Header.Status) {
                    req.body.Header['TransNo'] = PaymentData.Data.TransNo
                    Post.postData(req, res)
                } else {
                    if (PaymentData.created) {
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