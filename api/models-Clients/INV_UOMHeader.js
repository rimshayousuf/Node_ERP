const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_UOMHeader', {
    UOMHID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    UOMHeaderCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    UOMHeader: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    BaseUOMCode: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'INV_UOMHeader',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_UOMHe__8DF97173FD4DF327",
        unique: true,
        fields: [
          { name: "UOMHeaderCode" },
        ]
      },
    ]
  });
};
