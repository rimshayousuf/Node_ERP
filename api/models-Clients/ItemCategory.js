const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ItemCategory', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    ItemCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    CatID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'ItemCategory',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__ItemCate__3ECC0FEB857F96BF",
        unique: true,
        fields: [
          { name: "ItemCode" },
          { name: "CatID" },
        ]
      },
    ]
  });
};
