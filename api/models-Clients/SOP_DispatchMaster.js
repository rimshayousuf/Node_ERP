const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SOP_DispatchMaster', {
    RID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CustomerCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Customer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    TransType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TransDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "2021-01-02 06:51:13.613 +00:00"
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    Total: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    Total_Cur: {
      type: DataTypes.DECIMAL(20,5),
      allowNull: false
    },
    DriverName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    DriverContact: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    VehicleNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    DocumentNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ShippingMethodCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    ShippingMethod: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Posted: {
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
    },
    PostedUser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PrdID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Period: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    YearID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'SOP_DispatchMaster',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__SOP_Disp__9E5D30C3903ECFB7",
        unique: true,
        fields: [
          { name: "TransNo" },
        ]
      },
      {
        name: "UQ__SOP_Disp__9E5D30C2CF8C178C",
        unique: true,
        fields: [
          { name: "TransNo" },
        ]
      },
    ]
  });
};
