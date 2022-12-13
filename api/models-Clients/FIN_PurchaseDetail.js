const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_PurchaseDetail', {
    PurLineID: {type: DataTypes.INTEGER,allowNull: false,autoIncrement: true,primaryKey: true},
    TransNo: {type: DataTypes.STRING(255),allowNull: false},
    Code: {type: DataTypes.STRING(255),allowNull: false},
    Desc: {type: DataTypes.STRING(255),allowNull: false},
    AcctCode: {type: DataTypes.STRING(255),allowNull: false},
    AcctDesc: {type: DataTypes.STRING(255),allowNull: false},
    UOMCode: {type: DataTypes.STRING(255),allowNull: false},
    UOM: {type: DataTypes.STRING(255),allowNull: false},
    UnitQuantity: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    Quantity: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    BaseQuantity: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    UnitPrice: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    Amount: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    Amount_Cur: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    TaxDetailCode: {type: DataTypes.STRING(255),allowNull: false},
    TaxDetail: {type: DataTypes.STRING(255),allowNull: false},
    TaxRate: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    TaxAmount: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    TaxAmount_Cur: {type: DataTypes.DECIMAL(18,5),allowNull: false},
    TaxAcctCode: {type: DataTypes.STRING(255),allowNull: false},
    TaxAcctDesc: {type: DataTypes.STRING(255),allowNull: false},
    LineDescription: {type: DataTypes.STRING(255),allowNull: true},
}, {
        sequelize,
        tableName: 'FIN_PurchaseDetail',
    schema: 'dbo',
    timestamps: true,
    });
};
