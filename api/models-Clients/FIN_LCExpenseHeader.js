const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_LCExpenseHeader', {
        RID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        LCCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        LCDesc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        TransType: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TransNo: {
            type: DataTypes.STRING(255),
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
        tableName: 'FIN_LCExpenseHeader',
        schema: 'dbo',
        timestamps: true,
    });
};
