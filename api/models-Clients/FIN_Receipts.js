const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_Receipts', {
        RecID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        RecDesc: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        RecRefNo: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        CustID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CustCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CustDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CustAddrCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CustAddr: {
            type: DataTypes.STRING(255),
            allowNull: true
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
        AcctCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        AcctDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        RecAdrs: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        PrdID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TransDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        PayModeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PayModeCode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PayModeDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TransType: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TransNo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        CurID: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        TotalAmount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: false,
        },
        TaxDetailID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        TaxDetailCode: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        TaxDetail: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        TaxAmount: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        CheckDocNo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        SubTotal: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
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
        AplAmountCur: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true,
        },
        Closed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        JrnlID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // LayoutID: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
        CreatedUser: {
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
        tableName: 'FIN_Receipts',
        schema: 'dbo',
        timestamps: true,
    });
};
