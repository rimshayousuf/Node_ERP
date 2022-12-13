const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_AttributeCode', {
    AttCodeID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    AttHeadID: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    AttHeadCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AttHead: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AttCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AttValue: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INV_AttributeCode',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_Attri__D640D3FCACD1C6EE",
        unique: true,
        fields: [
          { name: "AttCodeID" },
        ]
      },
    ]
  });
};
