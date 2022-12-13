const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Sources', {
    SrcID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    SrcCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SrcDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'FIN_Sources',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Sour__27874722468E4824",
        unique: true,
        fields: [
          { name: "SrcID" },
        ]
      },
    ]
  });
};
