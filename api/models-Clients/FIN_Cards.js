const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Cards', {
    CardID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CardType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CardCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    CardName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Desig: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PostCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsSalesMan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsActive: {
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
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_Cards',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Cards__55FECD8ECCF80EB5",
        unique: true,
        fields: [
          { name: "CardID" },
        ]
      },
    ]
  });
};
