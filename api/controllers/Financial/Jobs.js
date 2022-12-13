const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
        let Columns = [["JobCode", "Code"], ["JobDesc", "Description"]]
        let RespData = await SeqFunc.getTreeAll(req.dbconn.FIN_Jobs, {}, true, Columns);
        if (RespData.success) {
            ResponseLog.Send200(req, res, RespData.Data);
        } else {
            ResponseLog.Send200(req, res, "No Record Found!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};

exports.getOne = async (req, res) => {
    try {

        let RespData = await SeqFunc.getOne(
            req.dbconn.FIN_Jobs,
            { where: { JobCode: req.query.JobCode } }
        );

        if (RespData.success) {
            let Data = {
                Header: RespData.Data
            };
            let DetailData = await SeqFunc.getAll(
                req.dbconn.FIN_JobDetail,
                { where: { JobID: RespData.Data.JobID } },
                false,
                ["Category", "VendorCode", "VendorDesc", "AcctCode", "AcctDesc", "Remarks", "TentativeAmount", "TaxDetailID", "TaxDetailCode", "TaxDetailDesc", "TaxDetailRate"]
            );

            if (DetailData.Data) {
                console.log({ Detail: DetailData.Data })
                let Selling = DetailData?.Data?.filter(v => Number(v.Category) === 1)
                let Buying = DetailData?.Data?.filter(v => Number(v.Category) === 2)
                let OperatingExpenses = DetailData?.Data?.filter(v => Number(v.Category) === 3)

                Data.Detail = {
                    Selling,
                    Buying,
                    OperatingExpenses
                }
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
        let RespData = await SeqFunc.getOne(
            req.dbconn.FIN_Jobs,
            { where: { JobCode: req.query.JobCode, UseCount: { [req.dbconn.Sequelize.Op.or]: [null, 0] } } }
        );

        if (RespData.success) {

            await req.dbconn.FIN_JobDetail.destroy({ where: { JobID: RespData.Data.JobID } })
            await req.dbconn.FIN_Jobs.destroy({ where: { JobID: RespData.Data.JobID } })

            ResponseLog.Delete200(req, res);
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
        let Detail = req.body.Detail ? req.body.Detail : undefined;

        Header.PJobID = Header.JobLevel === 0 ? null : req.body.Header.PJobID

        let RespData = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_Jobs,
            { where: { JobID: Header.JobID ? Header.JobID : 0 } },
            Header
        );

        if (RespData.success) {
            let JobArray = []
            if (Detail) {
                Detail?.Selling?.map(v => {
                    v.JobID = RespData.Data.JobID
                    JobArray.push(v)
                    return v;
                })
                Detail?.Buying?.map(v => {
                    v.JobID = RespData.Data.JobID
                    JobArray.push(v)
                    return v;
                })
                Detail?.OperatingExpenses?.map(v => {
                    v.JobID = RespData.Data.JobID
                    JobArray.push(v)
                    return v;
                })
            }


            await req.dbconn.FIN_JobDetail.destroy({ where: { JobID: RespData.Data.JobID } })

            let Lines = await SeqFunc.bulkCreate(
                req.dbconn.FIN_JobDetail,
                JobArray
            );

            console.log({ Lines })
            if (Lines.success) {

                if (Header.PJobID) {
                    await req.dbconn.FIN_Jobs.update({ JobHead: true }, { where: { JobID: Header.PJobID } })
                }
                if (RespData.created) {
                    ResponseLog.Create200(req, res);
                } else {
                    ResponseLog.Update200(req, res);
                }
            }
            else {
                ResponseLog.Error200(req, res, "Error saving Detail!");
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
