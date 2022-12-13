const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_Lines', {
        LineID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        JrnlID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        JrnlCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        JrnlDesc: {
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
        AcctType: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        LineDr: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        LineCr: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        LineDrCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        LineCrCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        JobCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        JobDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxRate: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true
        },
        LineDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxDr: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        TaxCr: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        TaxDrCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        TaxCrCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
        },
        TaxLine: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        Recon: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        ReconDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        LoanID: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'FIN_Lines',
        schema: 'dbo',
        timestamps: true,
    });
};
