const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_ItemClassAttributes', {
    IAttID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ItemClassID: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ItemClassCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ItemClass: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AttributeCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttributeType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    IsVariant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    AttHeadCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AttHead: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'INV_ItemClassAttributes',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__ItemClas__8CD26D65CE92E3F3",
        unique: true,
        fields: [
          { name: "IAttID" },
        ]
      },
    ]
  });
};
