const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POP_InvoiceDetail', {
    RID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",      
    },
    ILineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    GLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    GTransNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ItemCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ItemTrackBy: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ItemType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    JobCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    JobDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UOMCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UnitQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    GRPrice: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Price: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Quantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    BaseQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
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
    TaxScheduleID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TaxScheduleCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxSchedule: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TotalAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    QtyUsed: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true,
      defaultValue: 0
    },
    QtyCanceled: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    QtyReturn: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    LineDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    LineStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'POP_InvoiceDetail',
    schema: 'dbo',
    timestamps: true,
  });
};
