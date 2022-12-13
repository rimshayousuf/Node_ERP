const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_IssuanceDetail', {
    PickLineID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    PickID: {
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
    },
    StageCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    StageName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    StageSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    MachineCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    MachineName: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MOP_IssuanceDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_MOIs__C80E9F8F2686D8B6",
        unique: true,
        fields: [
          { name: "PickLineID" },
        ]
      },
    ]
  });
};
