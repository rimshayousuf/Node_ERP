const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_ItemLocation', {
    ItemLocID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    LocationID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ItemID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    ReOrderLevel: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    MinQty: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    MaxQty: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    SafetyStock: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'INV_ItemLocation',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_ItemL__40D94C492947096A",
        unique: true,
        fields: [
          { name: "LocationID" },
          { name: "ItemID" },
        ]
      },
    ]
  });
};
