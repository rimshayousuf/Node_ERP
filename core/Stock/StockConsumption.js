const db = require('./../../api/models-Clients/index');
const AppConfig = require('./../../AppConfig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.Consumption = async (req, TransNo) => {
    try {
        let Alloc = await req.dbconn.INV_StockAlloc.findAll({ where: { TransNo: TransNo }})

        Alloc = JSON.stringify(Alloc)
        Alloc = JSON.parse(Alloc)

        await req.dbconn.INV_StockDetail.bulkCreate(Alloc)
        await req.dbconn.INV_StockAlloc.destroy({ where: { TransNo: TransNo } })

        return { Success: true, Message: "Consumption Process Completed!"}
    }
    catch (ex) {
        console.log(ex)
        return { Success: false, Message: "Consumption Process RollBacked!", data: ex }
    }
};