const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Menu', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    PCID: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ControlID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ControlName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ControlType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    SortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    ImagePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    IsAP: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'Menu',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_Menu",
        unique: true,
        fields: [
          { name: "ControlID" },
        ]
      },
    ]
  });
};
