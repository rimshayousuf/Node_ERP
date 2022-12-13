const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POP_ReturnBatches', {
    RID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    RLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
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
    }
  }, {
    sequelize,
    tableName: 'POP_ReturnBatches',
    schema: 'dbo',
    timestamps: true,
  });
};
