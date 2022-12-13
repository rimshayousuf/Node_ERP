const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_AgingBucketsDays', {
    AgBkDtlID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AgBkID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FIN_AgingBuckets',
        key: 'AgBkID'
      }
    },
    AgBkCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    AgBkDesc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AgBkDtlName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DaysDueFrom: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DaysDueTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FIN_AgingBucketsDays',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Agin__850CB86EA26C44C1",
        unique: true,
        fields: [
          { name: "AgBkDtlID" },
        ]
      },
    ]
  });
};
