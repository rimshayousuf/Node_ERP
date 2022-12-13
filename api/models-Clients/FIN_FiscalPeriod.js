const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_FiscalPeriod', {
    PeriodID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_FiscalYear',
        key: 'YearID'
      }
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Financial: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Purchases: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Sales: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Inventory: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Manufacturing: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    tableName: 'FIN_FiscalPeriod',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__GN_Fisca__E521BB362FF41FFE",
        unique: true,
        fields: [
          { name: "PeriodID" },
        ]
      },
    ]
  });
};
