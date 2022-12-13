const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_ShiftDetail', {
    ShiftDID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ShiftHeadID: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ShiftHead: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ShiftName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    ShiftDName: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    StartAt: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    EndAt: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MOP_ShiftDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Shif__456CBD2E35ACFBB1",
        unique: true,
        fields: [
          { name: "ShiftDID" },
        ]
      },
    ]
  });
};
