const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const FIN_Bank = sequelize.define('FIN_Bank', {
    BankID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BankCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BankAC: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NextChequeNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CurID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CurCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CurName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AllowEFT: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    CreatedUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    ModifyUser: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'FIN_Bank',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Bank__AA08CB334B05A22A",
        unique: true,
        fields: [
          { name: "BankID" },
        ]
      },
    ]
  });
  FIN_Bank.associate = function (models) {
    FIN_Bank.belongsTo(models.FIN_Currencies, {
      as: 'Currency',
      foreignKey: "CurID",
    });
   
  };

  return FIN_Bank
};
