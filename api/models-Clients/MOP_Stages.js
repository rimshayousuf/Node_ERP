const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_Stages', {
    StageID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    StageCode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    StageName: {
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
    tableName: 'MOP_Stages',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Stag__03EB7AF8D4D94726",
        unique: true,
        fields: [
          { name: "StageID" },
        ]
      },
    ]
  });
};
