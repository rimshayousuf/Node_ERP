const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_VendorAddresss', {
    VendAddressID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VendID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VendCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ContactPerson: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Street: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Block: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Area: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    State: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PostCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Web: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PhoneNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_VendorAddresss',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Vend__7344BDF7D590A572",
        unique: true,
        fields: [
          { name: "VendAddressID" },
        ]
      },
    ]
  });
};
