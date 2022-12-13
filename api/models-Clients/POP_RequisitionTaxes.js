const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POP_RequisitionTaxes', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
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
      type: DataTypes.STRING(200),
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
    TaxAmount_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'POP_RequisitionTaxes',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__POP_Orde__CAFF41326F66071B",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
