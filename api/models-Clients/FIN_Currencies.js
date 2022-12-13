const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Currencies', {
    CurID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CurCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CurName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CurSymbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CurDecName: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'FIN_Currencies',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Currenci__2BA002A6F560E25E",
        unique: true,
        fields: [
          { name: "CurID" },
        ]
      },
    ]
  });
};
