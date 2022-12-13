const db = require("./../api/models-Clients/index");


exports.executeData = async (req, res) => {
    try {
        let UPD = "EXEC [dbo].[UpdateParallelData]"
        
        await req.dbconn.sequelize.query(UPD, {
            type: req.dbconn.Sequelize.QueryTypes.SELECT,
        });
        return true;
    }
    catch (ex) {
        console.log(ex)
        return false
    }
};