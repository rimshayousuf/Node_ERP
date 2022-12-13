const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.getList = async (req, res) => {
  try {
    let Columns = [["CustomerCode", "Customer Code"],["Customer", "Customer Name"],["CustCat", "Category"],"Alias", ["IsActive", "Status"]];

    let Customers = await SeqFunc.getAll(req.dbconn.FIN_Customers, {}, true, Columns);
    if (Customers.success) {
      ResponseLog.Send200(req, res, Customers.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let Customer = await SeqFunc.getOne(req.dbconn.FIN_Customers, { where:{CustomerCode: req.query.CustomerCode} });

    if (Customer.success) {
      let CustomerDetail = await SeqFunc.getAll(
        req.dbconn.FIN_CustomerAddress,
        { where:{CustCode: req.query.CustomerCode} },
        false,
        ["CustID","ContactPerson", "Address", "Street", "Block", "Area", "State", "Country", "PostCode"], 
      );
      if (CustomerDetail.success) {
        let Data = {
          Header: Customer.Data,
          Detail: CustomerDetail.Data
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
    let Customer = await SeqFunc.getOne(
      req.dbconn.FIN_Customers,
      {
        where: { CustomerCode: req.query.CustomerCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  },
      }
    );

    if (Customer.success) {
      await SeqFunc.Delete(req.dbconn.FIN_CustomerAddress, {
        where: { CustID: Customer.Data.CustID },
      });
      await SeqFunc.Delete(req.dbconn.FIN_Customers, {
        where: { CustID: Customer.Data.CustID, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] } },
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

    Header.CurID = Header.CurID === 0 ? 1 : Header.CurID

    let CustomerData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_Customers,
      { where:{CustomerCode: Header.CustomerCode} },
      Header
    );

    if (CustomerData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_CustomerAddress, { where:{CustCode: Header.CustomerCode} });

      Detail.map(o => {

        o.CustID = CustomerData.Data.CustID,
        o.CustCode = CustomerData.Data.CustomerCode,
        o.Active = true
        
        return o
      })

      await SeqFunc.bulkCreate(req.dbconn.FIN_CustomerAddress, Detail)

      if (CustomerData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
