const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_AttributeHead', {
    AttHeadID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    AttHeadCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AttHead: {
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
    tableName: 'INV_AttributeHead',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "IX_IN_AttributeHead",
        unique: true,
        fields: [
          { name: "AttHeadCode" },
        ]
      },
      {
        name: "PK__IN_Attri__755F70274041AC3F",
        unique: true,
        fields: [
          { name: "AttHeadID" },
        ]
      },
    ]
  });
};
