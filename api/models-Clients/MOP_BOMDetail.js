const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_BOMDetail', {
    BOMLineID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    BOMID: {
      type: DataTypes.INTEGER,
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
    CStatus: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    UOMCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UnitQuantity: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },
    Quantity: {
      type: DataTypes.DECIMAL(9,4),
      allowNull: false
    },
    BaseQuantity: {
      type: DataTypes.DECIMAL(9,4),
      allowNull: false
    },
    Wastage: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    StageCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    StageName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    StageSeq: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MachineCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    MachineName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PowerPerUnit: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0
    },
    LaborPerUnit: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0
    },
    OutputPerUnit: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0
    },
    StandardHours: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MOP_BOMDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_BOMD__B4B8ECD2A9C98C89",
        unique: true,
        fields: [
          { name: "BOMLineID" },
        ]
      },
    ]
  });
};
