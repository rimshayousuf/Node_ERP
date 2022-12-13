const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Seg1', {
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
    VSDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
      allowNull: true,
      defaultValue: true
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
    tableName: 'FIN_Seg1',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Seg1__421D64623A236A4B",
        unique: true,
        fields: [
          { name: "VSID" },
        ]
      },
      {
        name: "UQ__FIN_Seg1__4E3519604C30BFD7",
        unique: true,
        fields: [
          { name: "VSCode" },
        ]
      },
    ]
  });
};
