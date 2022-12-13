const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_Statuses', {
    RID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ECOM_Statuses',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_SOP_OrderStatus",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
