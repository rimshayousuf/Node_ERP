const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_ReturnMaster', {
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
      allowNull: false,
      defaultValue: 0
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
      allowNull: false,
      defaultValue: 0
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
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      unique: "UQ__SOP_Invo__9E5D30C2F2542233"
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "2021-01-02 06:51:13.613 +00:00"
    },
    TransTotal: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TransTotal_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    FreightAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    FreightAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    MiscAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    MiscAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    DiscAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    DiscAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    Total: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    Total_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Posted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
      allowNull: false,
      defaultValue: ""
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
    tableName: 'SOP_ReturnMaster',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__SOP_Ret__9E5D30C3354FAC4E",
        unique: true,
        fields: [
          { name: "TransNo" },
        ]
      },
      {
        name: "UQ__SOP_Ret__9E5D30C2F2542233",
        unique: true,
        fields: [
          { name: "TransNo" },
        ]
      },
    ]
  });
};
