const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");


exports.getList = async (req, res) => {
    try {
        let Columns = [["VSCode","Code"], ["VSDesc","Description"]]
        let RespData = await SeqFunc.getTreeAll(req.dbconn.FIN_Seg3, {}, true, Columns);
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
            req.dbconn.FIN_Seg3,
            { where: { VSCode: req.query.VSCode  } }
        );

        if (RespData.success) {
            let RespDetail = await SeqFunc.getAll(
                req.dbconn.FIN_CodeCombination,
                { where:{ VSCode: RespData.Data.VSCode } },
                false,
                [], 
              );

              let Data = {
                Header: RespData.Data,
                Detail: RespDetail.Data
              }
              if(RespDetail.success) {
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
        let RespData = await SeqFunc.getOne(
            req.dbconn.FIN_Seg3,
            { where: { VSID: req.query.VSID, VSUsed: 0 } }
        );
       

        if (RespData.success) {
            let CodeComb = await SeqFunc.Delete(
                req.dbconn.FIN_CodeCombination,
                { where:{ VSID: RespData.Data.VSID } } 
              );
              let Seg3 = await SeqFunc.Delete(
                req.dbconn.FIN_Seg3,
                { where: { VSID: req.query.VSID } }
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
    try {
        let Header = req.body.Header;
        let Detail = req.body.Detail
        delete Header.VSID
        let RespData = await SeqFunc.updateOrCreate(
            req.dbconn.FIN_Seg3,
            { where: { VSCode: Header.VSCode } },
            Header
        );

        if (RespData.success) {
            await SeqFunc.Delete(req.dbconn.FIN_CodeCombination, { where:{VSCode: Header.VSCode} });

            Detail?.map(o => {
              o.VSCode = Header.VSCode
              o.AcctCode = o.AcctCodeC
              return o
            })
      
            await SeqFunc.bulkCreate(req.dbconn.FIN_CodeCombination, Detail)

            if (RespData.created) {
                ResponseLog.Create200(req, res);
            } else {
                ResponseLog.Update200(req, res);
            }
        }
    } catch (err) {
        ResponseLog.Error200(req, res, err.message);
    }
};
