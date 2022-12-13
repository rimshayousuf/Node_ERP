const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_InvoiceBatches', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ILineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    BatchNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
    }
  }, {
    sequelize,
    tableName: 'SOP_InvoiceBatches',
    schema: 'dbo',
    timestamps: true
  });
};
