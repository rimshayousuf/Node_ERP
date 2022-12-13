const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('FIN_BankTransfer', {
    BTrfID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BTrfDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BTrfDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BTrfAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    BTrfAmountCur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    SrcBankID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SrcBankCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcBankDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcCurID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    SrcCurCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcCurDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcCurSymbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcExchRate: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    SrcJrnlID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DstBankID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DstBankCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstBankDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstBTrfAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    SrcBTrfAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    DstAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstCurID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DstCurCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstCurDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstCurSymbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DstExchRate: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: true
    },
    DstJrnlID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BranchCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PostedUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'FIN_BankTransfer',
    schema: 'dbo',
    timestamps: true
  });
};
