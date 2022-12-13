const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_DispatchDetail', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    DLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    OTransNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
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
    Job: {
      type: DataTypes.STRING(255),
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
    Quantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    BaseQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Price: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Amount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Amount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true,
      defaultValue: 0
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    NetAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true,
      defaultValue: 0
    },
    NetAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    QtyUsed: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    QtyCanceled: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    QtyReturn: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    LineStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'SOP_DispatchDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__RM_Dispa__FDF4198D7F7ABB1D",
        unique: true,
        fields: [
          { name: "DLineSeq" },
          { name: "TransNo" },
        ]
      },
    ]
  });
};
