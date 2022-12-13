const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const POP_RequisitionDetail = sequelize.define('POP_RequisitionDetail', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ItemCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ItemTrackBy: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ItemType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UOMCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UnitQuantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    Quantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    BaseQuantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    Price: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    SubTotal: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    SubTotal_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TaxScheduleCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    TaxSchedule: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TotalAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    UsedQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true,
      defaultValue: 0
    },
    CanceledQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true,
      defaultValue: 0
    },
    LineDescription: {
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
    tableName: 'POP_RequisitionDetail',
    schema: 'dbo',
    timestamps: true,
  });

  POP_RequisitionDetail.associate = function(models){
    POP_RequisitionDetail.hasMany(models.INV_ItemUOM,{
      as: "UOMArray",
      foreignKey:'UOMCode',
    })
  }

  return POP_RequisitionDetail

};
