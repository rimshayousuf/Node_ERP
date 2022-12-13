const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('POP_OrderMaster', {
    RID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    VendorCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Vendor: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CurID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CurCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CurDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ExchRate: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: false,
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    RefNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    RequireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    SubTotal: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    Freight: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    SubTotal_Cur: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    Freight_Cur: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    TotalAmount_Cur: {
      type: DataTypes.DECIMAL(20, 5),
      allowNull: false
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    StatusDesc: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    PostedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'POP_OrderMaster',
    schema: 'dbo',
    timestamps: true,
  });
};
