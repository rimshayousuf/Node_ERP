const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Budgets', {
    BudgID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BudgDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    BudgYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // primaryKey:true
    },
    Description: {
      type: DataTypes.STRING(4000),
      allowNull: false,
      defaultValue: ""
    },
    Version: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      // primaryKey: true
    },
    FPrdID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_FiscalPeriod',
        key: 'PeriodID'
      }
    },
    FPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TPrdID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_FiscalPeriod',
        key: 'PeriodID'
      }
    },
    TPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_Budgets',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Budg__99B0931AFC95EE69",
        unique: true,
        fields: [
          { name: "BudgID" },
        ]
      },
    ]
  });
};
