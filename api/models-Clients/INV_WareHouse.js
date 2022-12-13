const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_WareHouse', {
    RID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    WareHouseDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    WareHouseAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Geolocation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DealerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ContactNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IsPhoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IsVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ContactPersonName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INV_WareHouse',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Wareous__2608AFD947448B48",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
