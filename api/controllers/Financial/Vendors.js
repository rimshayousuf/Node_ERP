const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");

exports.getList = async (req, res) => {
  try {
    let Columns = [["VendorCode", "Vendor Code"],["Vendor", "Vendor Name"],["IsActive", "Status"],];

    let Vendors = await SeqFunc.getAll(req.dbconn.FIN_Vendors, {}, true, Columns);
    if (Vendors.success) {
      ResponseLog.Send200(req, res, Vendors.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let Vendor = await SeqFunc.getOne(req.dbconn.FIN_Vendors, { where:{VendorCode: req.query.VendorCode} });

    if (Vendor.success) {
      let VendorDetail = await SeqFunc.getAll(
        req.dbconn.FIN_VendorAddresss,
        { where:{VendID: Vendor.Data.VendID} },
        false,
        ["VendorCode","VendDesc", "PayTermCode", "PayTermDesc", "VendCatCode", "VendCatDesc", "AgBkCode", "AgBkDesc", "WHTaxCode", "WHTaxDesc"], 
      );
      if (VendorDetail.success) {
        let Data = {
          Header: Vendor.Data,
          Detail: VendorDetail.Data
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
    let Vendor = await SeqFunc.getOne(
      req.dbconn.FIN_Vendors,
      {
        where: { VendorCode: req.query.VendorCode, UseCount: { [req.dbconn.Sequelize.Op.or] : [null,0] }  },
      }
    );

    if (Vendor.success) {
      await SeqFunc.Delete(req.dbconn.FIN_VendorAddresss, {
        where: { VendID: Vendor.Data.VendID },
      });
      await SeqFunc.Delete(req.dbconn.FIN_Vendors, {
        where: { VendID: Vendor.Data.VendID },
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
    delete Header.VendID

    let VendorData = await SeqFunc.updateOrCreate(
      req.dbconn.FIN_Vendors,
      { where:{VendorCode: Header.VendorCode ? Header.VendorCode : ''} },
      Header
    );

    if (VendorData.success) {
      await SeqFunc.Delete(req.dbconn.FIN_VendorAddresss, { where:{VendID: Header.VendID} });

      Detail.map(o => {

        o.VendID = VendorData.Data.VendID,
        o.Active = true
        
        return o
      })

      await SeqFunc.bulkCreate(req.dbconn.FIN_VendorAddresss, Detail)
      
      if (VendorData.created) {
        ResponseLog.Create200(req, res);
      } else {
        ResponseLog.Update200(req, res);
      }
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
