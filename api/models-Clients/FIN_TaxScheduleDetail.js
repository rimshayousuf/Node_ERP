const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_TaxScheduleDetail', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    TaxScheduleID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxScheduleCode: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: true
    },
    TaxSchedule: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxDetailID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxDetail: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxDetailCode: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: true
    },
    TaxType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxRate: {
      type: DataTypes.DECIMAL(20,5),
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
    tableName: 'FIN_TaxScheduleDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_TaxS__F6E0D5EE8ACDA8E1",
        unique: true,
        fields: [
          { name: "TaxScheduleCode" },
          { name: "TaxDetailCode" },
        ]
      },
    ]
  });
};
