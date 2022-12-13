const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    RoleID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    RoleName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'Roles',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Roles__8AFACE3AD8379836",
        unique: true,
        fields: [
          { name: "RoleID" },
        ]
      },
    ]
  });
};
