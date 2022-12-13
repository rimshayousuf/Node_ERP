const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('FIN_LCCategories', {
        RID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        CatCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        CatDesc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        AcctCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        tableName: 'FIN_LCCategories',
        schema: 'dbo',
        timestamps: true,
    });
};
