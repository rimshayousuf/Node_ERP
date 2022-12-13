const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
        let Columns = [["JobCode", "Code"], "Customer", ["JobDesc", "Description"]]
        let RespData = await SeqFunc.getAll(req.dbconn.FIN_Jobs, {}, true, Columns);
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

        let Job = await req.dbconn.FIN_Jobs.findAll({ where: { Alias: Header.Alias } })
        console.log({ Job })
        if (Job && Job.length > 0) {
            let query = `SELECT JobCode = Alias + '-' + RIGHT('000000'+CAST(CAST(SUBSTRING(JobCode, CHARINDEX('-', JobCode)  + 1, LEN(JobCode)) AS INT) + 1 AS VARCHAR(6)),6)
            FROM FIN_Jobs WHERE JobID IN (SELECT JOBID = MAX(JobID) FROM FIN_Jobs WHERE Alias = '${Header.Alias}')`


            let getJobCode = await req.dbconn.sequelize.query(query, { type: req.dbconn.Sequelize.QueryTypes.SELECT })

            if (!Header.JobID) {
                Header.JobCode = getJobCode[0].JobCode;
            }
        }
        else {
            if (!Header.JobID) {
                Header.JobCode = `${Header.Alias}-000001`
            }
        }


        Header.PJobID = Header.JobLevel === 0 ? null : req.body.Header.PJobID

        let RespData = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_Jobs,
            { where: { JobID: Header.JobID } },
            Header
        );

        if (RespData.success) {
            let JobArray = []
            if (Detail) {
                Detail?.Selling?.map(v => {
                    if (v.AcctCode !== '') {
                        v.JobID = RespData.Data.JobID
                        JobArray.push(v)
                        return v;
                    }
                })
                Detail?.Buying?.map(v => {
                    if (v.AcctCode !== '') {
                        v.JobID = RespData.Data.JobID
                        JobArray.push(v)
                        return v;
                    }
                })
                Detail?.OperatingExpenses?.map(v => {
                    if (v.AcctCode !== '') {
                        v.JobID = RespData.Data.JobID
                        JobArray.push(v)
                        return v;
                    }
                })
            }




            await req.dbconn.FIN_JobDetail.destroy({ where: { JobID: RespData.Data.JobID } })

            let Lines = await SeqFunc.bulkCreate(
                req.dbconn.FIN_JobDetail,
                JobArray
            );

            console.log({ Lines })
            if (Lines.success) {
                if (RespData.created) {
                    ResponseLog.Create200(req, res);
                } else {
                    ResponseLog.Update200(req, res);
                }
            }
            else {
                ResponseLog.Error200(req, res, "Error saving Detail!");
            }
        } else {
            ResponseLog.Error200(req, res, "Error Saving Record!");
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
