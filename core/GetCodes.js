

exports.AccountCodes = async function (req, FormName, Code) {
    try {
        let Account;
        switch (FormName) {
            case "Taxes":
                Account = await req.dbconn.FIN_TaxDetail.findOne({ where: { TaxDetailCode: Code } }); break;
            case "Vendors":
                Account = await req.dbconn.FIN_Vendors.findOne({ where: { VendorCode: Code } }); break;
            case "Customers":
                Account = await req.dbconn.FIN_Customers.findOne({ where: { CustomerCode: Code } }); break;
            case "Banks":
                Account = await req.dbconn.FIN_Bank.findOne({ where: { BankCode: Code } }); break;
            case "Items":
                Account = await req.dbconn.INV_Item.findOne({ where: { ItemCode: Code } }); break;
            default: break;
        }
        if (Account) {
            return {
                success: true,
                Account: Account,
            }
        }
        else {
            return {
                success: false,
                Account: {}
            }
        }
    }
    catch (ex) {
        console.log(ex)
        return {
            success: false,
            JrnlID: null,
            message: "Error generating Financials!",
            Detail: ex.message
        }
    }
};