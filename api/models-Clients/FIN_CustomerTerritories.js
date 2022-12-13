const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_CustomerTerritories', {
    CustTerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CustTerCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CustTer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PCustTerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustTerLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustTerHead: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CustTerUsed: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'FIN_CustomerTerritories',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Cust__CE796BB6EFB5F340",
        unique: true,
        fields: [
          { name: "CustTerID" },
        ]
      },
    ]
  });
};
