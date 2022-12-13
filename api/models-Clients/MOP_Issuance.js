const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_Issuance', {
    PickID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    TransType: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    MOTransNo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    ItemCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UOMCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    UOM: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    RoutingCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    RoutingName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UnitQuantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    Quantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    BaseQuantity: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    LocationCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    StageCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    StageName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    StartTime: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    EndTime: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UnitStarted: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    UnitsProduced: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    RequireQC: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    CreatedUser: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MOP_Issuance',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK_MOP_Issuance",
        unique: true,
        fields: [
          { name: "PickID" },
        ]
      },
    ]
  });
};
