const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_VendorProfiles', {
    VendProfileID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VendProfileCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VendProfileDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PayTermID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PayTermCode: {
      type: DataTypes.STRING(255),
      allowNull: true
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
      allowNull: true
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
    AllowDiscount: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ChargeInterest: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:true
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
    }
  }, {
    sequelize,
    tableName: 'FIN_VendorProfiles',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_VendProf__F43060C93FEFEC83",
        unique: true,
        fields: [
          { name: "VendProfileID" },
        ]
      },
    ]
  });
};
