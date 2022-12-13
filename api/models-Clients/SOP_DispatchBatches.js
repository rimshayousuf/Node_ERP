const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_DispatchBatches', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    DLineSeq: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    BatchNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Quantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    },
    BaseQuantity: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'SOP_DispatchBatches',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__RM_Dispa__4BD199CBDDD5FBE7",
        unique: true,
        fields: [
          { name: "TransNo" },
          { name: "DLineSeq" },
        ]
      },
    ]
  });
};
