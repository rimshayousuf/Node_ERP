const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_RoutingHeader', {
    RoutingID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    RoutingCode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    RoutingName: {
      type: DataTypes.STRING(100),
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
      allowNull: false,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'MOP_RoutingHeader',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Rout__A763F8A8B779D5F4",
        unique: true,
        fields: [
          { name: "RoutingID" },
        ]
      },
    ]
  });
};
