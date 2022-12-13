const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Company', {
    CompID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CompCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "IX_Company"
    },
    CompName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Address1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Address2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    City: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    State: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ContactPerson: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ContactNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    URL: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DB_Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DB_Server: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DB_User: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DB_Pass: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsTrial: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ExpiredOn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UsersLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Seg1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Seg2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Seg3: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SegSize1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SegSize2: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    SegSize3: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Segments: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DefaultCurID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DefaultCurCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DefaultCurDesc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DefaultCurSymbol: {
      type: DataTypes.STRING(255),
      allowNull: false
    }

  }, {
    sequelize,
    tableName: 'Company',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "IX_Company",
        unique: true,
        fields: [
          { name: "CompCode" },
        ]
      },
      {
        name: "PK__Company__969C5CE27C485AFB",
        unique: true,
        fields: [
          { name: "CompID" },
        ]
      },
    ]
  });
};
