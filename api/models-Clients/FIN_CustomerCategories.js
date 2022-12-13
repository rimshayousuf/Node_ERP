const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_CustomerCategories', {
    CustCatID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CustCatCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CustCat: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PCustCatID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustCatLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CustCatHead: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CustCatUsed: {
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
      allowNull: true
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
    tableName: 'FIN_CustomerCategories',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Cust__85F33309582DCC47",
        unique: true,
        fields: [
          { name: "CustCatID" },
        ]
      },
    ]
  });
};
