const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_LCExpenseDetail', {
        RID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        HID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        CatCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        CatDesc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        AcctCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        Amount: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'FIN_LCExpenseDetail',
        schema: 'dbo',
        timestamps: true,
    });
};
