const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Vendors', {
    VendID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VendorCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Vendor: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PayTermID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PayTermCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PayTermDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VendCatID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    VendCatCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VendCatDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    FinChInterestRate: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: false
    },
    MinInvValforFinCh: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: false
    },
    CreditLimit: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: false
    },
    TaxScheduleID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TaxScheduleCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxSchedule: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AgBkID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AgBkCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AgBkDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CurID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CurCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CurDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PayAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    FrgtAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DiscAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AccPurAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PurAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PayAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    FrgtAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DiscAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AccPurAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PurAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    NTNNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    STRegNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VendProfileID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    VendProfileCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VendProfileDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    RemitToAdrID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AllowDiscount: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ChargeInterest: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
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
    Email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PhoneNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_Vendors',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Vendors__4D2385B6183A1DFD",
        unique: true,
        fields: [
          { name: "VendID" },
        ]
      },
      {
        name: "UQ__FIN_Vendors__37D4549F7CB75560",
        unique: true,
        fields: [
          { name: "VendCode" },
        ]
      },
    ]
  });
};
