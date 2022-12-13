const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_Machine', {
    MachineID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    MachineCode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MachineName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    PurchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    InstalledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'MOP_Machine',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Mach__44EE5B58958288C4",
        unique: true,
        fields: [
          { name: "MachineID" },
        ]
      },
    ]
  });
};
