const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_MainBanner', {
    BannerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    BannerTitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsAllow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    BannerImage: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    RelatedCategory: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ECOM_MainBanner',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MainBann__32E86A31BC9AA011",
        unique: true,
        fields: [
          { name: "BannerID" },
        ]
      },
    ]
  });
};
