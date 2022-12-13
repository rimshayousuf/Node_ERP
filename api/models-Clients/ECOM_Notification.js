const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ECOM_Notification', {
    NotificationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    NotificationImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Notificationtitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Notificationbody: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    data: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    User: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'ECOM_Notification',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__Notifica__20CF2E32085F7330",
        unique: true,
        fields: [
          { name: "NotificationID" },
        ]
      },
    ]
  });
};
