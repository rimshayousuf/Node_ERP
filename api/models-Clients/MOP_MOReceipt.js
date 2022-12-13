const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_MOReceipt', {
    ReceiptID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ReceiptNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    ReceiptDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    LocationCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    DepartmentCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    ItemCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    Quantity: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    UOM: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    BatchCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    BinCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    CreatedUser: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    PostedUser: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ModifyUser: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'MOP_MOReceipt',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_MORe__CC08C400A429860B",
        unique: true,
        fields: [
          { name: "ReceiptID" },
        ]
      },
    ]
  });
};
