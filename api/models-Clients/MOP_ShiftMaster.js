const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_ShiftMaster', {
    ShiftHeadID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    StartAt: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Shifts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'MOP_ShiftMaster',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Shif__DECEADC5D410C58D",
        unique: true,
        fields: [
          { name: "ShiftHeadID" },
        ]
      },
    ]
  });
};
