const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_Jobs', {
    JobID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    JobCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    JobDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    JobDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CustomerCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Customer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Alias: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PJobID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    JobLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    JobHead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    JobUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    L1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    L2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    L3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    L4: {
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
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'FIN_Jobs',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "Jobs_JobCode_unique",
        unique: true,
        fields: [
          { name: "JobCode" },
        ]
      },
      {
        name: "PK__FIN_Jobs__8FA9A8D9FBE0193B",
        unique: true,
        fields: [
          { name: "JobID" },
          { name: "JobCode" },
        ]
      },
    ]
  });
};
