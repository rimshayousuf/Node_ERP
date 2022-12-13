const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POP_InvoiceMaster', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    RefNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ShipDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    VendorCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Vendor: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CurID: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    SubTotal: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    SubTotal_Cur: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },

    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Freight: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Freight_Cur: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },
    Discount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Discount_Cur: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },
    LCAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    LCAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TotalAmount_Cur: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },
    Posted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'POP_InvoiceMaster',
    schema: 'dbo',
    timestamps: true
  });
};
