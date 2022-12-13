const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_DispatchTaxes', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    },
    DLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ItemCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Item: {
      type: DataTypes.STRING(255),
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
    TaxDetailID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TaxDetailCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxDetail: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TaxRate: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    TaxableTax: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'SOP_DispatchTaxes',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__SOP_Disp__E31A923EF2EFA2FC",
        unique: true,
        fields: [
          { name: "RID" },
          { name: "TransNo" },
        ]
      },
    ]
  });
};
