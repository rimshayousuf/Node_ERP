const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_ExchRates', {
    Exch_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Tran_CurID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_Currencies',
        key: 'CurID'
      }
    },
    Base_CurID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ExchRate: {
      type: DataTypes.DECIMAL(19,5),
      allowNull: false
    },
    ConvMethd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ExchDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_ExchRates',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Exch__3E68C0F3138A651F",
        unique: true,
        fields: [
          { name: "Exch_ID" },
        ]
      },
    ]
  });
};
