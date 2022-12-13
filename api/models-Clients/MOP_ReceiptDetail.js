const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_ReceiptDetail', {
    ReceiptLineID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ReceiptID: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    CItemCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    CItemName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UOMCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    }
  }, {
    sequelize,
    tableName: 'MOP_ReceiptDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_MORct__C80E9F8F2686D8B6",
        unique: true,
        fields: [
          { name: "ReceiptLineID" },
        ]
      },
    ]
  });
};
