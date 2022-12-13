const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_OrderLog', {
    RID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Action: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    UserAction: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ECOM_OrderLog',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_SOP_OrderLog",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
