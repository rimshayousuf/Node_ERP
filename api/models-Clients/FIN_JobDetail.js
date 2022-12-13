const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('FIN_JobDetail', {
    JobDID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    JobID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Category: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VendorCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendorDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Remarks: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    TentativeAmount: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: true
    },
    TaxDetailID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TaxDetailCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TaxDetailDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TaxDetailRate: {
      type: DataTypes.DECIMAL(18, 5),
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
    }
  }, {
    sequelize,
    tableName: 'FIN_JobDetail',
    schema: 'dbo',
    timestamps: true,
  });
};
