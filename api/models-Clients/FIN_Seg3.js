const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Seg3', {
    VSID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VSCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VSCB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Control: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    VSDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    PVSID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VSLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VSHead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ResCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    VSUsed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    BankID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    AcctType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TypBal: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_Seg3',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Seg3__421D64620ABC2E72",
        unique: true,
        fields: [
          { name: "VSID" },
        ]
      },
      {
        name: "UQ__FIN_Seg3__4E351960C63D8B75",
        unique: true,
        fields: [
          { name: "VSCode" },
        ]
      },
    ]
  });
};
