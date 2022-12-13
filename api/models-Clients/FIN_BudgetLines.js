const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_BudgetLines', {
    BudgLID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BudgHID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_Budgets',
        key: 'BudgID'
      }
    },
    BudgYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_FiscalPeriod',
        key: 'PeriodID'
      }
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_BudgetLines',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Budg__7A55815B3B24EA46",
        unique: true,
        fields: [
          { name: "BudgLID" },
        ]
      },
    ]
  });
};
