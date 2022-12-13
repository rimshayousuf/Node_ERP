const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_Taxes', {
        TaxID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        TaxCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TaxDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TaxType: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        TaxRate: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PaidAcctCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PaidAcctDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        DrS1: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        CrS1: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        DrS2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        CrS2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        DrS3: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        CrS3: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        UseCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        sequelize,
        tableName: 'FIN_Taxes',
        schema: 'dbo',
        timestamps: true,
    });
};
