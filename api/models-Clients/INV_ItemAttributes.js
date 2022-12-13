const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_ItemAttributes', {
    IAttID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      allowNull: false
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttributeCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttributeType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttHeadCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttHead: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    IsVariant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'INV_ItemAttributes',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__ItemAttr__8CD26D654AC38FD2",
        unique: true,
        fields: [
          { name: "IAttID" },
        ]
      },
    ]
  });
};
