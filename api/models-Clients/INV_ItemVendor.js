const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_ItemVendor', {
    ItemVenID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    VendorID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    VendorCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Vendor: {
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
    }
  }, {
    sequelize,
    tableName: 'INV_ItemVendor',
    schema: 'dbo',
    timestamps: true,
  });
};
