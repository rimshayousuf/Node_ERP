const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_SalesApp', {
        SaleAppID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        SaleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SaleDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        RecID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SaleType: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        RecType: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        AplAmount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
            defaultValue: true
        },
        AplDisc: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'FIN_SalesApp',
        schema: 'dbo',
        timestamps: true,
    });
};
