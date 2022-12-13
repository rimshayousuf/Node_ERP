const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_Location', {
    LocationID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ParentLocationID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Address1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Address2: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Address3: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Province: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ContactPerson: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    PhoneNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    MobileNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    FaxNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    IsTransit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'INV_Location',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_Locat__E7FEA4778C6DD436",
        unique: true,
        fields: [
          { name: "LocationID" },
        ]
      },
    ]
  });
};
