const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_CareOf', {
    RID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CareOfCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CareOf: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    }
  }, {
    sequelize,
    tableName: 'FIN_CareOf',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_CareOf__2158D5C5DDD51F22",
        unique: true,
        fields: [
          { name: "CareOfCode" },
        ]
      },
    ]
  });
};
