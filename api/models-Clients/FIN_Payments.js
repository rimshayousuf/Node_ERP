const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_Payments', {
        PayID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        PayDesc: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        PayRefNo: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        BankID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        BankCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        BankDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TaxDetailID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        TaxDetailCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxDetail: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxRate: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: false,
        },
        AcctCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        AcctDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TransNo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TransType: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        VendID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        VendCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        VendDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        VendAddrCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        VendAddr: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PayAdrs: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        PrdID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        TransDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        PayModeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        PayModeCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PayModeDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        JobID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        JobCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        JobDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        CurCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CurDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ExchRate: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: false,
        },
        SubTotal: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        SubTotalCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        TotalAmountCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        TaxAmountCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        TaxCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxAmount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        TotalAmount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        CheckDocNo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        Discount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        DiscountCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        AplAmount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        Closed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        JrnlID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        LayoutID: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        CreatedUser: {
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
        },
    }, {
        sequelize,
        tableName: 'FIN_Payments',
        schema: 'dbo',
        timestamps: true,
    });
};
