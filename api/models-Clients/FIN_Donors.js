const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('FIN_Donors', {
    DonorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    DonorCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DonorType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DonorName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Designation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CareOfCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CareOf: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ParentCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Parent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Phone2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NTN_No: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CNIC: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    }
  }, {
    sequelize,
    tableName: 'FIN_Donors',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Donors__2158D5C5DDD51F22",
        unique: true,
        fields: [
          { name: "DonorCode" },
        ]
      },
    ]
  });
};
