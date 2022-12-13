const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Stock = require("../../../core/Stock");
// const { Op } = require("sequelize/types");
const sequelize = require("sequelize");


exports.postData = async (req, res) => {
  try {
    let TransNo = req.body.Header.TransNo;
    let MOI = await SeqFunc.getOne(req.dbconn.MOP_MOReceipt, { where: { TransNo: TransNo } });
    let Data = {}
    let JrnlID = [];

    if (MOI.success) {

      let PickData = await req.dbconn.MOP_Issuance.findAll({ where: { MOTransNo: TransNo }, attributes: ["JrnlID"] })

      PickData?.Data.map(v => JrnlID.push(v.JrnlID))

      const GLAmount = await req.dbconn.FIN_Lines.findAll({
        attributes: [
          'JrnlID',
          [sequelize.fn('sum', sequelize.col('LineDr')), 'Amount'],
        ],
        group: ['JrnlID'],
        raw: true
      });

      Data = {
        RecordDate: new Date(),
        LocationCode: req.body.Header.LocationCode,
        Location: req.body.Header.Location,
        ItemCode: req.body.Header.ItemCode,
        Item: req.body.Header.Item,
        ItemTrackBy: 'None',
        BatchNo: '',
        ExpiryDate: '',
        TransType: 'MOR',
        TransNo: req.body.Header.MOTransNo,
        TransDate: req.body.Header.TransDate,
        Quantity: req.body.Header.Quantity,
        UnitPrice: GLAmount,
        AvgCost: GLAmount,
        LineNo: 1,
        QtySold: 0,
        QtyAlloc: 0,
        Status: 0,
      }

      let Stock = await Stock.Addition.RawAddition(Data, res);

      if (Stock.success === true) {
        let ItemAccounts = await GetCodes.AccountCodes(req, 'Items', v.ItemCode)
        Detail.push({
          AcctCode: ItemAccounts.Account.Inventory_GLCode,
          AcctDesc: ItemAccounts.Account.Inventory_GLCode,
          AcctType: 'Inventory',
          LineDr: GLAmount,
          LineCr: 0,
          LineDrCur: GLAmount,
          LineCrCur: 0,
          JobCode: '',
          JobDesc: '',
          TaxCode: '',
          TaxDesc: '',
          LineDesc: '',
          TaxDr: 0.0,
          TaxCr: 0.0,
          TaxDrCur: 0.0,
          TaxCrCur: 0.0,
          TaxLine: 0,
          Recon: 0,
          ReconDate: null,
          LoanID: null,
        })
        Detail.push({
          AcctCode: ItemAccounts.Account.WIP_GLCode,
          AcctDesc: ItemAccounts.Account.WIP_GLCode,
          AcctType: 'Inventory Offset',
          LineDr: 0,
          LineCr: GLAmount,
          LineDrCur: 0,
          LineCrCur: GLAmount,
          JobCode: '',
          JobDesc: '',
          TaxCode: '',
          TaxDesc: '',
          LineDesc: '',
          TaxDr: 0.0,
          TaxCr: 0.0,
          TaxDrCur: 0.0,
          TaxCrCur: 0.0,
          TaxLine: 0,
          Recon: 0,
          ReconDate: null,
          LoanID: null,
        })

        let JVData = await JV.Create(req, { GRN, Detail })

        if (JVData.success) {

          await req.dbconn.MOP_MOReceipt.update({
            Status: 1,
            Posted: 1,
            PostedUser: req.headers.username,
            postedAt: new Date(),
            JrnlID: JVData.JrnlID
          },
            {
              where: { TransNo: TransNo },
            })

          ResponseLog.Send200(req, res, "Record Posted Successfully");
        } else {

          ResponseLog.Error200(req, res, Stock.Message);
        }
      }
      else {
        ResponseLog.Error200(req, res, "No Record Found!");
      }


    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
