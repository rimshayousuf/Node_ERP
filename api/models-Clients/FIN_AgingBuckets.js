const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_AgingBuckets', {
    AgBkID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AgBkCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AgBkDesc: {
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
      allowNull: true,
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
    tableName: 'FIN_AgingBuckets',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Agin__6139DAA9A8F593FF",
        unique: true,
        fields: [
          { name: "AgBkID" },
        ]
      },
    ]
  });
};
