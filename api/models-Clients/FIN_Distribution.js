const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const FIN_Distribution = sequelize.define('FIN_Distribution', {
    RID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    JobCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    JobDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LineDr: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: true
    },
    LineCr: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: true
    },
    LineDrCur: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: true
    },
    LineCrCur: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'FIN_Distribution',
    schema: 'dbo',
    timestamps: false,
  });

  return FIN_Distribution
};
