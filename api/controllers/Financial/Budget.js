const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const MaterialData = require("../../../core/MaterialData");


exports.getList = async (req, res) => {
  try {
    let Columns = [["BudgDate", "Budget Date"], ["BudgYear", "Budget Year"], ["Description", "Description"], ["Version", "Version"]];
    let Budgets = await SeqFunc.getAll(req.dbconn.FIN_Budgets, {}, true, Columns);
    if (Budgets.success) {
      ResponseLog.Send200(req, res, Budgets.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let Budget = await SeqFunc.getOne(req.dbconn.FIN_Budgets, { where: { BudgID: req.query.BudgID } });

    if (Budget.success) {
      let BudgetDetails = await req.dbconn.FIN_BudgetLines.findAll({ attributes: ["AcctCode", "AcctDesc", "PrdID", "Period", "YearID", "Amount"], where: { BudgHID: req.query.BudgID } })

      // let columns = ["AcctCode", "AcctDesc"]
      // let DetailData = await MaterialData.LookUp(BudgetDetails, columns);

      if (BudgetDetails) {
        let Data = {
          Header: Budget.Data,
          Detail: BudgetDetails
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
    let Budget = await SeqFunc.getOne(
      req.dbconn.FIN_Budgets,
      {
        where: { BudgID: req.query.BudgID },
      }
    );

    if (Budget.success) {
      await SeqFunc.Delete(req.dbconn.FIN_BudgetLines, {
        where: { BudgHID: req.query.BudgID },
      });
      await SeqFunc.Delete(req.dbconn.FIN_Budgets, {
        where: { BudgID: req.query.BudgID },
      });
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
    let Detail = req.body.Detail;

    // Header.CurID === 0 ? 1 : Header.CurID

    let BudgetData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_Budgets,
      { where: { Version: Header.Version } },
      Header
    );

    if (BudgetData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_BudgetLines, { where: { BudgHID: BudgetData.Data.BudgID } });

      Detail.map(o => {
        o.BudgHID = BudgetData.Data.BudgID
        o.BudgYear = BudgetData.Data.BudgYear
        // o.PrdID = o.PeriodID

        return o
      })

      await SeqFunc.bulkCreate(req.dbconn.FIN_BudgetLines, Detail)

      if (BudgetData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    console.log(err)
    ResponseLog.Error200(req, res, err.message);
  }
};
