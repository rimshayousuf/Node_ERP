const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MOP_RoutingDetail', {
    RoutingLineID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    RoutingID: {
      type: DataTypes.BIGINT,
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
    StageCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    StageName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    MachineCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    MachineName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PowerPerUnit: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0
    },
    LaborPerUnit: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0
    },
    OutputPerUnit: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false,
      defaultValue: 0
    },
    StandardHours: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false
    },
    StageSeq: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'MOP_RoutingDetail',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__MOP_Rout__117E22DBF6B82617",
        unique: true,
        fields: [
          { name: "RoutingLineID" },
        ]
      },
    ]
  });
};
