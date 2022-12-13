const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_RequisitionMaster', {
    RID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    RequireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UserDef1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UserDef2: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UserDef3: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UserDef4: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    StatusDesc: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: false
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    },
    PostedUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INV_RequisitionMaster',
    schema: 'dbo',
    timestamps: true,
  });
};
