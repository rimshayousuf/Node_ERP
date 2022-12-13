const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_Batches', {
        BatchID: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        BatchDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BatchName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BatchCtrlToT: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        BatchWorkToT: {
            type: DataTypes.DECIMAL(18, 5),
            allowNull: true
        },
        BatchStatus: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        NoOfJrnls: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        PrdID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PrdCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PrdDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CurCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CurDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        BatchCreateDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        BatchPostDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
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
        tableName: 'FIN_Batches',
        schema: 'dbo',
        timestamps: true,
    });
};
