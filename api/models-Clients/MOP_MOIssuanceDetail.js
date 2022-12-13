const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_MOIssuanceDetail', {
    PickID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    PickNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    PickDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    CItemCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Quantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    LocationCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    BatchNo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    BinCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    StageCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'MOP_MOIssuanceDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_MOIs__C80E9F8FE0F8618C",
        unique: true,
        fields: [
          { name: "PickID" },
        ]
      },
    ]
  });
};
