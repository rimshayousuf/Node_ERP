const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INV_ItemClass', {
    ItemClassID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ItemClassCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ItemClass: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    TaxScheduleID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TaxScheduleCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    TaxSchedule: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    UOMClassCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    UOMClass: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INV_ItemClass',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__IN_ItemC__75576F80F9876855",
        unique: true,
        fields: [
          { name: "ItemClassID" },
        ]
      },
    ]
  });
};
