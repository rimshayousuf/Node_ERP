const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_NextNo', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    TransID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Prefix: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    DocLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    NextNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
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
    tableName: 'MOP_NextNo',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Next__CAFF41327C24C7E4",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
