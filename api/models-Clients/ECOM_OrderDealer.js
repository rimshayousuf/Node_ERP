const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_OrderDealer', {
    RID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TransNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DealerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AssignOn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsRejected: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    RejectedOn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsDispatch: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    DispatchOn: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SalesPersonId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ECOM_OrderDealer',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_SOP_OrderDealer",
        unique: true,
        fields: [
          { name: "RID" },
        ]
      },
    ]
  });
};
