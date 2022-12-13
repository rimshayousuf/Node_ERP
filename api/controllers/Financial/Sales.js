const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require('./PostSales');
const con = require("../../../AppConfig")
const GetCodes = require("../../../core/GetCodes");



exports.getList = async (req, res) => {
    try {
        let Columns = ["TransNo", "TransDate", ["CustDesc", "Customer"],
            ["CurDesc", "Currency"], ["TotalR", "Total Amount"], "Description", ["RStatus", "Status"], ["PostedBy", "Posted By"]]
        let Sales = await SeqFunc.getAll(req.dbconn.FIN_Sales, { where: {}, order: [["createdAt", "DESC"]] }, true, Columns);
        if (Sales.success) {
            Sales.Data.rows.map((val) => {
                val.Description = val.SaleDesc;
                val.RStatus = val.Status ? "Posted" : "Un-Posted";
                val.TransDate = con.MomentformatDate(val.TransDate)
                val.TransDate = con.MomentformatDate(val.TransDate)
                val.TotalR = con.currencyFormat(val.TotalAmount)

                val.CreatedBy = val.CreatedUser + ' ' + con.MomentformatDateTime(val.createdAt);
                val.PostedBy = val.Status ? val.PostedUser + ' ' + con.MomentformatDateTime(val.postedAt) : "";

                return val;
            });
            ResponseLog.Send200(req, res, Sales.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        let Sales = await SeqFunc.getOne(
            req.dbconn.FIN_Sales,
            { where: { TransNo: req.query.TransNo } }
        );

        if (Sales.success) {
            let CusAccount = await GetCodes.AccountCodes(req, 'Customers', Sales.Data.CustCode)

            let SalesDetail = await SeqFunc.getAll(
                req.dbconn.FIN_SaleDetail,
                { where: { TransNo: Sales.Data.TransNo } },
                true,
                ["Code", "Desc", "AcctCode", "AcctDesc", "UOMCode", "UOM", "UnitQuantity", "Quantity", "BaseQuantity", "UnitPrice", "Amount", "Amount_Cur", "TaxDetailCode",
                    "TaxDetail", "TaxRate", "TaxAmount", "TaxAmount_Cur", "TaxAcctCode", "TaxAcctDesc", "LineDescription"]
            );
            if (SalesDetail.success) {

                Sales.Data['RecAcctCode'] = CusAccount.Account.RecAcctCode;
                Sales.Data['RecAcctDesc'] = CusAccount.Account.RecAcctDesc;

                Sales.Data['DiscAcctCode'] = CusAccount.Account.DiscAcctCode;
                Sales.Data['DiscAcctDesc'] = CusAccount.Account.DiscAcctDesc;

                Sales.Data['FrgtAcctCode'] = CusAccount.Account.FrgtAcctCode;
                Sales.Data['FrgtAcctDesc'] = CusAccount.Account.FrgtAcctDesc;

                // await Promise.all(
                // SalesDetail?.Data?.rows?.map(async v => {
                //     v.TaxAmount_Cur = v.TaxAmountCur
                //     let Tax = await GetCodes.AccountCodes(req, 'Taxes', v.TaxDetailCode)
                //     v.AcctCode = Tax.Account.AcctCode
                //     v.AcctDesc = Tax.Account.AcctDesc
                //     return v;
                // })
                // )

                let Data = {
                    Header: Sales.Data,
                    Detail: SalesDetail.Data
                }
                ResponseLog.Send200(req, res, Data);
            } else {
                ResponseLog.Error200(req, res, "No Record Found!");
            }
            // ResponseLog.Send200(req, res, Sales.Data);
        } else {
            ResponseLog.Error200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let Sales = await SeqFunc.getOne(
            req.dbconn.FIN_Sales,
            { where: { TransNo: req.query.TransNo, Closed: 0 } }
        );

        if (Sales.success) {
            await SeqFunc.Delete(
                req.dbconn.FIN_Sales,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_SalesTaxes,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_SaleDetail,
                { where: { TransNo: req.query.TransNo } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Journals,
                { where: { JrnlID: Sales.JrnlID } }
            );
            await SeqFunc.Delete(
                req.dbconn.FIN_Lines,
                { where: { JrnlID: Sales.JrnlID } }
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
        let Detail = req.body.Detail ? req.body.Detail : [];
        delete Header.RID;
        Header.CreatedUser = req.headers.username;
        Header.ModifyUser = req.headers.username;

        let SalesData = await SeqFunc.Trans_updateOrCreate(
            req.dbconn,
            req.dbconn.FIN_Sales,
            req.dbconn.FIN_NextNo,
            {
                where: { TransNo: Header.TransNo ? Header.TransNo : "" },
                transaction: t,
            },
            Header,
            t
        );

        if (SalesData.success) {
            Detail = Detail.filter(v => v.AcctCode !== '')
            Detail.map((o) => {
                o.TransNo = SalesData.Data.TransNo;
                delete o.SaleLineID;
                return o;
            });

            let DetailData = await SeqFunc.Trans_bulkCreate(
                req.dbconn.FIN_SaleDetail,
                { where: { TransNo: SalesData.Data.TransNo }, transaction: t },
                Detail,
                t
            );

            if (DetailData.success) {
                await t.commit();
                if (Header.Status) {
                    req.body.Header['TransNo'] = SalesData.Data.TransNo
                    Post.postData(req, res)
                } else {
                    if (SalesData.created) {
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
