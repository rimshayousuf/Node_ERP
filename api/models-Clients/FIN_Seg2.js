const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Seg2', {
    VSID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VSCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    VSDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PVSID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VSLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VSHead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ResCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    VSUsed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_Seg2',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Seg2__421D6462A1188581",
        unique: true,
        fields: [
          { name: "VSID" },
        ]
      },
      {
        name: "UQ__FIN_Seg2__4E3519602F223C97",
        unique: true,
        fields: [
          { name: "VSCode" },
        ]
      },
    ]
  });
};
