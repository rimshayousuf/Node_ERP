const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_Receipt', {
    ReceiptID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    TransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    MOTransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    LocationCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ItemCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    UOMCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
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
    tableName: 'MOP_Receipt',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_MORe__CC08C400B73B3AD0",
        unique: true,
        fields: [
          { name: "ReceiptID" },
        ]
      },
    ]
  });
};
