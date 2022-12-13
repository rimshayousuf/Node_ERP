const ResponseLog = require("../../../core/ResponseLog");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


exports.CreateOrUpdate = async (req, res) => {
    try {
        let Header = req.body.Header;
        let Detail = req.body.Detail;

        if (Header.FormType === "Vendor") {
            let data = await req.dbconn.FIN_Vendors.findAll({
                where: { VendorCode: { [Op.between]: [Header.FromCode, Header.ToCode] } },
                attributes: ["VendID","VendorCode", "Vendor"]
            })
            if (data) {
                data = JSON.stringify(data);
                data = JSON.parse(data);

                Promise.all(
                    data.map(v => {
                        Detail.map(val => {
                            val.VendorID = v.VendID
                            val.VendorCode = v.VendorCode
                            val.Vendor = v.Vendor
                            return val;
                        })
                    })
                )

                await req.dbconn.INV_ItemVendor.destroy({ where: { VendorCode: { [Op.between]: [Header.FromCode, Header.ToCode] } } })

                await req.dbconn.INV_ItemVendor.bulkCreate(Detail)

                ResponseLog.Send200(req, res,"Process Completed Successfully!");
            }

        }
        else {
            let data = await req.dbconn.INV_Location.findAll({
                where: { LocationCode: { [Op.between]: [Header.FromCode, Header.ToCode] } },
                attributes: ["LocationID","LocationCode", "Location"]
            })

            if (data) {
                data = JSON.stringify(data);
                data = JSON.parse(data);

                Promise.all(
                    data.map(v => {
                        Detail.map(val => {
                            val.LocationID = v.LocationID
                            val.LocationCode = v.LocationCode
                            val.Location = v.Location
                            val.ReOrderLevel = 0
                            val.MinQty = 0
                            val.MaxQty = 0
                            val.SafetyStock = 0

                            return val
                        })
                    })
                )


                await req.dbconn.INV_ItemLocation.destroy({ where: { LocationCode: { [Op.between]: [Header.FromCode, Header.ToCode] } } })

                await req.dbconn.INV_ItemLocation.bulkCreate(Detail)


            }
            ResponseLog.Send200(req, res,"Process Completed Successfully!");
        }

    }
    catch (err) {
        console.log(err);
        ResponseLog.Error200(req, res, err.message);
    }
};
