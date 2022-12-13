const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_CustomerAddress', {
    CustAdrID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CustID: {
      type: DataTypes.INTEGER,
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
      allowNull: true
    },
    Block: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Area: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    State: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CustCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_CustomerAddress',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Cust__5CF46211E0DD91C2",
        unique: true,
        fields: [
          { name: "CustAdrID" },
        ]
      },
    ]
  });
};
