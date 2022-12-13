const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_RequisitionDetail', {
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
      defaultValue: ""
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
    UsedQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    CanceledQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
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
    tableName: 'INV_RequisitionDetail',
    schema: 'dbo',
    timestamps: true,
  });
};
