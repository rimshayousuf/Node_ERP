const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_PurApplication', {
        PurAppID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        PurID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PurDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PayID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PayDesc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        PurType: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PayType: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        AplAmount: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: false,
            defaultValue: true
        },
        AplDisc: {
            type: DataTypes.DECIMAL(18,5),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'FIN_PurApplication',
        schema: 'dbo',
        timestamps: true,
    });
};
