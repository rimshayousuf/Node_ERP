const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_CustomerProfiles', {
    CPID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CPCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CP: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Collector: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CollectorCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CollectorName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SalesPerson: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SalesPersonCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SalesPersonName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OrderBooker: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OrderBookerCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OrderBookerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PayTermID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PayTermCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PayTerm: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustCatID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CustCatCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustCat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ShipMID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ShipMCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ShipM: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustTerID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CustTerCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CustTer: {
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
    AgBk: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PriceLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FrgtAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DiscAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    RecAcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SaleAcctCode: {
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
    RecAcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SaleAcctDesc: {
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
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_CustomerProfiles',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__CustProf__F5B22BE656EEA83F",
        unique: true,
        fields: [
          { name: "CPID" },
        ]
      },
    ]
  });
};
