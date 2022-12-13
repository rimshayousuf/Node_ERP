var fs = require("fs");
//const db = require("../api/models/index");

const db = require("../api/models-Clients/index");
const SeqFunc = require("./SeqFunc");


exports.Error200 = async (req, resp, err) => {
  let response = "";
  resp.writeHead(200, "Server Response with Failure", {
    "content-type": "application/json",
  });
  response = JSON.stringify({ Success: false, Message: err });
  resp.write(response);
  var log = "\n Log Started on" + new Date().toISOString();
  log = log + "\n ************************************************** \n";
  log = log + "\n API : " + req.baseUrl + " -- Method : " + req.method;
  log = log + "\n FormName : " + req.body.FormName;
  log = log + "\n Message : " + response;
  log =
    log + "\n **************************************************  \n Log Ended";
  fs.appendFile("log.txt", log,(err)=>{});
  resp.end();
};

exports.Delete200 = async (req, resp) => {
  // await db.sequelize.query("EXEC UpdateUseCount", {
  //   type: Sequelize.QueryTypes.SELECT,
  // });
  let response = "";
  resp.writeHead(200, "Record Deleted Successfully!", {
    "content-type": "application/json",
  });
  response = JSON.stringify({
    Success: true,
    Message: "Record Deleted Successfully!",
  });
  resp.write(response);
  resp.end();
};

exports.Create200 = async (req, resp) => {
  // await db.sequelize.query("EXEC UpdateUseCount", {
  //   type: Sequelize.QueryTypes.SELECT,
  // });
      let response = "";
      resp.writeHead(200, "Record Created Successfully!", {
        "content-type": "application/json",
      });
      response = JSON.stringify({
        Success: true,
        Message: "Record Created Successfully!",
      });
      resp.write(response);
      resp.end();
};

exports.Update200 = async (req, res) => {
  // await db.sequelize.query("EXEC UpdateUseCount", {
  //   type: Sequelize.QueryTypes.SELECT,
  // });
      let response = "";
      res.writeHead(200, "Record Updated Successfully!", {
        "content-type": "application/json",
      });
      response = JSON.stringify({
        Success: true,
        Message: "Record Updated Successfully!",
      });
      res.write(response);
      res.end();
};

exports.Send200 = async (req, res, data) => {
  let response = "";
  res.writeHead(200, "Server Response with Success", {
    "content-type": "application/json",
  });
  response = JSON.stringify({
    Success: true,
    Message: data,
  });
  res.write(response);
  res.end();
};

exports.incrementUseCount = async (req, res, where, model) => {

  let models = [
    { model: 'FIN_AgingBuckets', value: ['AgBkID'] },
    { model: 'FIN_AgingBucketsDays', value: ['AgBkDtlID'] },
    { model: 'FIN_Bank', value: ['BankID', 'SrcBankID', 'DstBankID'] },
    { model: 'FIN_Batches', value: ['BatchID', 'BudgHID'] },
    { model: 'FIN_BudgetLines', value: ['BudgLID'] },
    { model: 'FIN_Currencies', value: ['CurID', 'SrcCurID', 'DstCurID', 'Tran_CurID', 'Base_CurID'] },
    { model: 'FIN_Cards', value: ['CardID'] },
    { model: 'FIN_Categories', value: ['CatID'] },
    { model: 'FIN_CodeCombination', value: ['AcctCode', 'PaidAcctCode'] },

    { model: 'FIN_CustomerAddress', value: ['CustAdrID'] },
    { model: 'FIN_CustomerCategories', value: ['CustCatID'] },
    { model: 'FIN_CustomerProfiles', value: ['CPID'] },
    { model: 'FIN_VendorCategory', value: ['VendCategoryID', 'VendCatID'] },
    { model: 'FIN_Customers', value: ['CustID', 'Collector', 'SalesPerson', 'OrderBooker',] },
    { model: 'FIN_CustomerTerritories', value: ['CustTerID'] },
    { model: 'FIN_ExchRates', value: ['ExchID'] },
    { model: 'FIN_FiscalPeriod', value: ['PeriodID'] },
    { model: 'FIN_FiscalYear', value: ['YearID'] },
    { model: 'FIN_Jobs', value: ['JobID'] },
    { model: 'FIN_Journals', value: ['JrnlID'] },
    { model: 'FIN_LCCategories', value: ['CatCode', 'PaidAcctCode'] },
    { model: 'FIN_LCCode', value: ['LCCode'] },
    { model: 'FIN_LCExpenseDetail', value: ['RID'] },

  ]


  let modelToBeUpdated = []
  let modelToBeUpdatedForDetails = []

  let responseData = await SeqFunc.getOne(model, where)

  const Header = responseData.Data
  const Detail = req.body.Detail

  const HeaderArr = Object.keys(Header)
  const DetailArr = Object.keys(Detail[0])


  for (let i = 0; i < models.length; i++) {
    for (let j = 0; j < models[i].value.length; j++) {
      if (HeaderArr.includes(models[i].value[j])) {
        modelToBeUpdated.push(models[i].model)
      }

      if (DetailArr.includes(models[i].value[j])) {
        modelToBeUpdatedForDetails.push(models[i].model)
      }

    }
  }

  modelToBeUpdated.map(async (model) => {
    let respData = await SeqFunc.getOne(req.dbconn[model], where)
    if (respData) {
      await SeqFunc.updateOrCreate(req.dbconn[model], where, { UseCount: respData.Data.UseCount + 1 })
    }
  })

  modelToBeUpdatedForDetails.map(async (model) => {
    let respData = await SeqFunc.getOne(req.dbconn[model], where)
    if (respData) {
      await SeqFunc.updateOrCreate(db[req.headers.compcode][model], where, { UseCount: respData.Data.UseCount + Detail.length })
    }

  })

}
