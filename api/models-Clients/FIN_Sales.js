const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_Sales', {
        SaleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        SaleDesc: {
            type: DataTypes.INTEGER,
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
        LocationID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        LocationCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TransDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        TransNo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PayTermID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PayTermCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PayTermDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TransType: {
            type: DataTypes.STRING(255),
            allowNull: true
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
        ExchRate: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        SubTotal: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        CostAmount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        CostAmountCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        SubTotalCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        TotalAmountCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        TaxAmountCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        TaxCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TaxAmount: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        TotalAmount: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        BillToAdrID : {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        BillToAdrCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BillToAdrDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        ShipToAdrID : {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ShipToAdrCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        ShipToAdrDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Discount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        SpDiscount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        Freight: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        DiscountCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        FreightCur: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        PrdID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        SalesManID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        SalesManCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        SalesManDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        DiscAmount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        AplAmount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true,
        },
        Closed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        JrnlID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        LayoutID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        CreatedUser: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Status: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        tableName: 'FIN_Sales',
        schema: 'dbo',
        timestamps: true,
    });
};
