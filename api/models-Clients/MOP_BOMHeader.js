const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_BOMHeader', {
    BOMID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ItemCode: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ItemName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UOMCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UnitQty: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true
    },
    BillStatus: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    RoutingName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    RoutingCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    EffectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ObseleteDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    StockMethod: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    CreatedUser: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'MOP_BOMHeader',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_BOMH__0D05DC8A2E9039C0",
        unique: true,
        fields: [
          { name: "BOMID" },
        ]
      },
      {
        name: "PK_MOP_BOMHeader",
        unique: true,
        fields: [
          { name: "ItemCode" },
          { name: "UOMCode" },
          { name: "BillStatus" },
        ]
      },
    ]
  });
};
