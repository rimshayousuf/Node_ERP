const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_BankRecon', {
        BRecID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        BankID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        BankCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BankDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CurCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurSymbol: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BAcctCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        BAcctDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        StDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        StEndAmt: {
            type: DataTypes.DECIMAL(20,5),
            allowNull: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'FIN_BankRecon',
        schema: 'dbo',
        timestamps: true,
    });
};
