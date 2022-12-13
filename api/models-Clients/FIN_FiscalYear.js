const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const FIN_FiscalYear = sequelize.define('FIN_FiscalYear', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    EndDate: {
      type: DataTypes.DATEONLY,
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
    tableName: 'FIN_FiscalYear',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Fisc__C33A18ADB7C8F80F",
        unique: true,
        fields: [
          { name: "YearID" },
        ]
      },
    ]
  });
  FIN_FiscalYear.associate = function(models){
    FIN_FiscalYear.hasMany(models.FIN_FiscalPeriod,{
      foreignKey:'YearID'
    })
  }

  return FIN_FiscalYear
};
