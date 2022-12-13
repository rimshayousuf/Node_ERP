const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_Coupon', {
    CouponID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CouponName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CouponDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CouponCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DiscountAmount: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsAllow: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Priority: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RedemptionTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RedemptionConditionID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MaximumRedemptionAmount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ECOM_Coupon',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__ECOM_Cou__384AF1DA8C935182",
        unique: true,
        fields: [
          { name: "CouponID" },
        ]
      },
    ]
  });
};
