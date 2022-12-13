const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const FIN_Journals = sequelize.define('FIN_Journals', {
        JrnlID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        JrnlName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        JrnlDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        JrnlDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CatID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CatCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        CatDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        SrcID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SrcCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        SrcDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BankID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        BankCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        BankDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BatchID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Batch: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        JrnlTotDr: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlTotCr: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlTotDrCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlTotCrCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        CurID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CurCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        CurDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurSymbol: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        ExchRate: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlStatus: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue:0
        },
        // JrnlCreateDate: {
        //     type: DataTypes.DATEONLY,
        //     allowNull: true
        // },
        TransNo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TransType: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CardID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        CardCode: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        CardDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxInc: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        JrnlTaxDr: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlTaxCr: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlTaxDrCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JrnlTaxCrCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        JType: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PrdID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ChkRV: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        BranchCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        YearID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CheckDocNo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CreatedUser: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ""
        },
        PostedUser: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ""
        },
        ModifyUser: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ""
        },
        postedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'FIN_Journals',
        schema: 'dbo',
        timestamps: true,
    });

    FIN_Journals.associate = function (models) {
        FIN_Journals.hasMany(models.FIN_Lines, {
            as: 'Lines',
            foreignKey: "JrnlID",
        });
        FIN_Journals.belongsTo(models.FIN_Cards, {
            as: 'Card',
            foreignKey: "CardID",
        });
        FIN_Journals.belongsTo(models.FIN_Currencies, {
            as: 'Currency',
            foreignKey: "CurID",
        });
    };

    return FIN_Journals
};
