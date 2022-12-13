const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_VendorCategory', {
    VendCategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VendCategoryCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VendCategoryDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PVendCategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VendCategoryLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    VendCategoryHead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    VendCategoryUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    L1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    L2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    L3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    L4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'FIN_VendorCategory',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Vend__3A134741E04F5DA7",
        unique: true,
        fields: [
          { name: "VendCategoryID" },
        ]
      },
    ]
  });
};
