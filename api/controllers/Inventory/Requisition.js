const db = require("../../models-Clients/index");
const ResponseLog = require("../../../core/ResponseLog");
const SeqFunc = require("../../../core/SeqFunc");
const Post = require("./PostRequisition");
const con = require("../../../AppConfig")

exports.getList = async (req, res) => {
  try {
    let Columns = ["TransNo", "TransDate", "Location", "Description", ["StatusR","Status"], ["SubmittedBy", "Submitted By"]];
    let REQ = await SeqFunc.getAll(
      req.dbconn.INV_RequisitionMaster,
      {},
      true,
      Columns
    );
    if (REQ.success) {

      REQ?.Data?.rows?.map(v => {
        v.TransDate = con.MomentformatDate(v.TransDate)
        v.StatusR = v.Status ? 'Submitted' : 'Pending'
        v.SubmitStatus = v.Status
        v.CreatedBy = v.CreatedUser + ' ' + con.MomentformatDateTime(v.createdAt);
        v.SubmittedBy = v.SubmitStatus ? v.PostedUser + ' ' + con.MomentformatDateTime(v.postedAt) : "";
        return v;
      })

      ResponseLog.Send200(req, res, REQ.Data);
    } else {
      ResponseLog.Error200(req, res, "No Record Found!");
    }
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let REQ = await SeqFunc.getOne(
      req.dbconn.INV_RequisitionMaster,
      {
        where: { TransNo: req.query.TransNo },
      }
    );

    if (REQ.success) {
      let Detail = await SeqFunc.getAll(
        req.dbconn.INV_RequisitionDetail,
        { where: {TransNo: REQ.Data.TransNo} },
        false,
        [
          "TransNo",
          "RLineSeq",
          "ItemCode",
          "Item",
          "ItemTrackBy",
          "UOMCode",
          "UOM",
          "UnitQuantity",
          "Quantity",
          "BaseQuantity",
          "Price",
          "Amount",
          "Remarks",
        ]
      );

      
    let UOMColumns = ["ItemCode","UOMCode", "UOM", "UnitQuantity"];

    let UOMData = await req.dbconn.INV_ItemUOM.findAll({ attributes: UOMColumns })

    Detail = JSON.stringify(Detail)
    Detail = JSON.parse(Detail)

    await Promise.all(
      Detail.Data.map(async val => {
        val.UOMArray = UOMData.filter(v => v.ItemCode === val.ItemCode)

        return val;
      })
    )
      let Data = {
        Header: REQ.Data,
        Detail: Detail.Data,
      };

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
    let REQ = await SeqFunc.getOne(
      req.dbconn.INV_RequisitionMaster,
      {
        where: { TransNo: req.query.TransNo, SubmitStatus: false },
      }
    );

    if (REQ.success) {
      await SeqFunc.Delete(req.dbconn.INV_RequisitionDetail, {
        where: { TransNo: REQ.Data.TransNo },
      });
      await SeqFunc.Delete(req.dbconn.INV_RequisitionMaster, {
        where: { TransNo: REQ.Data.TransNo },
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
  const t = await req.dbconn.sequelize.transaction();
  try {
    let Header = req.body.Header;
    let Detail = req.body.Detail;
    delete Header.RID;
    Header.CreatedUser = req.headers.username;
    Header.ModifyUser = req.headers.username;

    Header.StatusDesc = Header.SubmitStatus ? "Submitted" : "Pending";
    Header.Status = Header.SubmitStatus

    let REQData = await SeqFunc.Trans_updateOrCreate(
      req.dbconn,
      req.dbconn.INV_RequisitionMaster,
      req.dbconn.INV_NextNo,
      {
        where: { TransNo: Header.TransNo ? Header.TransNo : "" },
        transaction: t,
      },
      Header,
      t
    );

    if (REQData.success) {
      let i = 1;
      Detail = Detail.filter(v => v.ItemCode !== '')
      Detail.map((o) => {
        delete o.RID
        o.TransNo = REQData.Data.TransNo;
        o.RLineSeq = i;
        i++;
        return o;
      });

      let REQDetailData = await SeqFunc.Trans_bulkCreate(
        req.dbconn.INV_RequisitionDetail,
        { where: { TransNo: REQData.Data.TransNo }, transaction: t },
        Detail,
        t
      );
      if (REQDetailData.success) {
        await t.commit();
        if (Header.Status) {
          req.body.Header['TransNo'] = REQData.Data.TransNo
          Post.postData(req,res);
        } else {
          if (REQData.created) {
            ResponseLog.Create200(req, res);
          } else {
            ResponseLog.Update200(req, res);
          }
        }
      } else {
        t.rollback();
        ResponseLog.Error200(req, res, "Error Saving Record!");
      }
    } else {
      t.rollback();
      ResponseLog.Error200(req, res, "Error Saving Record!");
    }
  } catch (err) {
    t.rollback();
    ResponseLog.Error200(req, res, err.message);
  }
};

exports.postingData = async (req, res) => {
  try {
    Post.postData(req, res);
  } catch (err) {
    ResponseLog.Error200(req, res, err.message);
  }
};
