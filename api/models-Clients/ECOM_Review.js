const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_Review', {
    ReviewID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ReviewDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    RatingCount: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    ItemCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UserName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'ECOM_Review',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Review__74BC79AE5100A403",
        unique: true,
        fields: [
          { name: "ReviewID" },
        ]
      },
    ]
  });
};
