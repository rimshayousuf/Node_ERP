const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    UserID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    UserName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    Designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ContactNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    CompID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Company',
        key: 'CompID'
      }
    }
  }, {
    sequelize,
    tableName: 'Users',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Users__1788CCACFADAC9C2",
        unique: true,
        fields: [
          { name: "UserID" },
        ]
      },
    ]
  });
};
