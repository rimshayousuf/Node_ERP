const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_OfferBanner', {
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
    BannerDesc: {
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
    },
    RelatedProduct: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DisplayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'ECOM_OfferBanner',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__OfferBan__32E86A3126B87220",
        unique: true,
        fields: [
          { name: "BannerID" },
        ]
      },
    ]
  });
};
