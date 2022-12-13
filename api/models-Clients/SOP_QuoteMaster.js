const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_QuoteMaster', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CusPONo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CustomerCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Customer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CusAddCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
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
    ExchRate: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: false
    },
    SalesPersonCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SalesPerson: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PaymentTermsCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PaymentTerms: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      unique: "UQ__SOP_Quot__9E5D30C253BE33D4"
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TransTotal: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    FreightAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    MiscAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    DiscAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Total: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TransTotal_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    FreightAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    MiscAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    DiscAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    Total_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    SubmitStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
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
    PostedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'SOP_QuoteMaster',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__SOP_Quot__9E5D30C3EFF0FFF0",
        unique: true,
        fields: [
          { name: "TransNo" },
        ]
      },
      {
        name: "UQ__SOP_Quot__9E5D30C253BE33D4",
        unique: true,
        fields: [
          { name: "TransNo" },
        ]
      },
    ]
  });
};
