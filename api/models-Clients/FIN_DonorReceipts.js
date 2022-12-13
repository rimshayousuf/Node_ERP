const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_DonorReceipts', {
        RecID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        TransNo: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        TransDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        DonorCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        DonorName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CareOfCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CareOf: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CampaignCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        Campaign: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        RecAcctCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        RecAcctDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        BankCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        BankName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        BankAcctCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        BankAcctDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        DepositType: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ChequeNo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ChequeBankName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ChequeDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        Remarks: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        Amount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        JobCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        JobDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PrdID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        CurID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Closed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        JrnlID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }, CreatedUser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        BranchCode: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        Period: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        YearID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ModifyUser: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        PostedUser: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        postedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'FIN_DonorReceipts',
        schema: 'dbo',
        timestamps: true,
    });
};
