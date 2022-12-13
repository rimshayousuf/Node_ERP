const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_PayModes', {
    PayModeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    PayModeCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PayModeDesc: {
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
    tableName: 'FIN_PayModes',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_PayM__39BD51EED52D3DB5",
        unique: true,
        fields: [
          { name: "PayModeID" },
        ]
      },
    ]
  });
};
