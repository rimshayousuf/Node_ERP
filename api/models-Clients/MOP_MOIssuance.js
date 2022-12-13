const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_MOIssuance', {
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
    PickDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    LocationCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    DepartmentCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    StageCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    MachineCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    StartTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    EndTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UnitStarted: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    UnitsProduced: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    RequireQC: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    CreatedUser: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    PostedUser: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'MOP_MOIssuance',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_MOIs__AD14109515025999",
        unique: true,
        fields: [
          { name: "PickLineID" },
        ]
      },
    ]
  });
};
