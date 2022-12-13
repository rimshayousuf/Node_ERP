const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('POP_NextNo', {
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
    tableName: 'POP_NextNo',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__POP_Next__CAFF41321CDD1FD9",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
