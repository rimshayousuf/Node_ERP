const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_NextNo', {
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
    tableName: 'INV_NextNo',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_NextN__CAFF41322ABFAA7E",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
