const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const INV_ItemUOM = sequelize.define('INV_ItemUOM', {
    ItemUOMID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    ItemID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'INV_Item',
        key: 'ItemID'
      }
    },
    ItemCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UOMDID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    UOMCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UnitQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'INV_ItemUOM',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_IN_ItemUOM",
        unique: true,
        fields: [
          { name: "ItemCode" },
          { name: "UOMCode" },
        ]
      },
    ]
  });

  INV_ItemUOM.associate = function(models){
    INV_ItemUOM.belongsTo(models.POP_RequisitionDetail,{
      foreignKey:'UOMCode'
    })
  }

  return INV_ItemUOM
};
