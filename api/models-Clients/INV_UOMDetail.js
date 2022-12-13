const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_UOMDetail', {
    UOMDID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    UOMCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    UOMHID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    UOMHeaderCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UOMHeader: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
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
    }
  }, {
    sequelize,
    tableName: 'INV_UOMDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_UOMDe__56E8F46E757877D2",
        unique: true,
        fields: [
          { name: "UOMCode" },
          { name: "UOMHID" },
        ]
      },
    ]
  });
};
