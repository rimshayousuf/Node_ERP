const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_ShippingMethods', {
    ShippingMethodID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ShippingMethodCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ShippingMethodDesc: {
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
    tableName: 'FIN_ShippingMethods',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Ship__0C7833842DF24203",
        unique: true,
        fields: [
          { name: "ShippingMethodID" },
        ]
      },
    ]
  });
};
