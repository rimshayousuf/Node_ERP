const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_LCCodes', {
        RID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        LCCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        LCDesc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        BankName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        VendorName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        VenBankName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        LCDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        UseCount: {
            type: DataTypes.INTEGER,
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
        }
    }, {
        sequelize,
        tableName: 'FIN_LCCodes',
        schema: 'dbo',
        timestamps: true,
    });
};
