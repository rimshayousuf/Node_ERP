const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require('./PostPurchases');
const con = require("../../../AppConfig")
const GetCodes = require("../../../core/GetCodes");



exports.getList = async (req, res) => {
    try {

        let Columns = ["TransNo", "TransDate", ["VendDesc", "Vendor"],
            ["CurDesc", "Currency"], ["TotalR", "TotalAmount"], "Description", ["RStatus", "Status"], ["PostedBy", "Posted By"]]
        let Purchase = await SeqFunc.getAll(req.dbconn.FIN_Purchases, { where: {}, order: [["createdAt", "DESC"]] }, true, Columns);
        if (Purchase.success) {
            Purchase.Data.rows.map((val) => {
                val.Description = val.PurDesc;
                val.RStatus = val.Status ? "Posted" : "Un-Posted";
                val.TransDate = con.MomentformatDate(val.TransDate)
                val.TotalR = con.currencyFormat(val.TotalAmount)

                val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
                val.PostedBy = val.Status === 1 ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

                return val;
            });
            ResponseLog.Send200(req, res, Purchase.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        console.log(err)
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        let Purchase = await SeqFunc.getOne(
            req.dbconn.FIN_Purchases,
            { where: { TransNo: req.query.TransNo } }
        );

        if (Purchase.success) {
            let VenAccount = await GetCodes.AccountCodes(req, 'Vendors', Purchase.Data.VendCode)
            let PurchaseDetail = await SeqFunc.getAll(
                req.dbconn.FIN_PurchaseDetail,
                { where: { TransNo: Purchase.Data.TransNo } },
                true,
                ["Code","Desc","AcctCode","AcctDesc","UOMCode","UOM","UnitQuantity","Quantity","BaseQuantity","UnitPrice","Amount","Amount_Cur","TaxDetailCode",
                "TaxDetail","TaxRate","TaxAmount","TaxAmount_Cur","TaxAcctCode","TaxAcctDesc","LineDescription"]
            );

            Purchase.Data['PayAcctCode'] = VenAccount.Account.PayAcctCode;
            Purchase.Data['PayAcctDesc'] = VenAccount.Account.PayAcctDesc;

            Purchase.Data['DiscAcctCode'] = VenAccount.Account.DiscAcctCode;
            Purchase.Data['DiscAcctDesc'] = VenAccount.Account.DiscAcctDesc;

            Purchase.Data['FrgtAcctCode'] = VenAccount.Account.FrgtAcctCode;
            Purchase.Data['FrgtAcctDesc'] = VenAccount.Account.FrgtAcctDesc;


            // await Promise.all(
            //     PurchaseDetail?.Data?.rows?.map(async v => {
            //         let Tax = await GetCodes.AccountCodes(req, 'Taxes', v.TaxDetailCode)
            //         v.AcctCode = Tax.Account.AcctCode
            //         v.AcctDesc = Tax.Account.AcctDesc
            //         return v;
            //     })
            // )

            if (PurchaseDetail.success) {
                let Data = {
                    Header: Purchase.Data,
                    Detail: PurchaseDetail.Data
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
        let Purchase = await SeqFunc.getOne(
            req.dbconn.FIN_Purchases,
            { where: { TransNo: req.query.TransNo, Closed: 0 } }
        );

        if (Purchase.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_Purchases,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_PurTaxes,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_PurchaseDetail,
                { where: { TransNo: Purchase.Data.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Journals,
                { where: { JrnlID: Purchase.JrnlID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: Purchase.JrnlID } }
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
        delete Header.PurID;
        Header.CreatedUser = req.headers.username;
        Header.ModifyUser = req.headers.username;

        let PurchaseData = await SeqFunc.Trans_updateOrCreate(
            req.dbconn,
            req.dbconn.FIN_Purchases,
            req.dbconn.FIN_NextNo,
            {
                where: { TransNo: Header.TransNo ? Header.TransNo : "" },
                transaction: t,
            },
            Header,
            t
        );

        if (PurchaseData.success) {

            Detail = Detail.filter(v => v.AcctCode !== '')

            Detail.map((o) => {
                o.TransNo = PurchaseData.Data.TransNo;
                delete o.PurLineID;
                return o;
            });

            let DetailData = await SeqFunc.Trans_bulkCreate(
                req.dbconn.FIN_PurchaseDetail,
                { where: { TransNo: PurchaseData.Data.TransNo }, transaction: t },
                Detail,
                t
            );
            if (DetailData.success) {
                await t.commit();
                if (Header.Status) {
                    req.body.Header['TransNo'] = PurchaseData.Data.TransNo
                    Post.postData(req, res)
                } else {
                    if (PurchaseData.created) {
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
