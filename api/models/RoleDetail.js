const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RoleDetail', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    ControlID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Menu',
        key: 'ControlID'
      }
    },
    RoleID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Roles',
        key: 'RoleID'
      }
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Create: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    View: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    Edit: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    Delete: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    Post: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    Approval: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'RoleDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__RoleDeta__CAFF41326BE262E9",
        unique: true,
        fields: [
          { name: "ControlID" },
          { name: "RoleID" },
        ]
      },
    ]
  });
};
