const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FIN_CodeCombination', {
    AcctCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    AcctDesc: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    AcctCodeC: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VSCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S1L1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S1L2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S2L1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S2L2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3L1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3L2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3L3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3L4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3L5: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AcctType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TypBal: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OpBal: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true,
      defaultValue: 0
    },
    CrBal: {
      type: DataTypes.DECIMAL(18,5),
      allowNull: true,
      defaultValue: 0
    },
    Enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    CB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Control: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    UseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    AcctAlias: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S1Desc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S2Desc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    S3Desc: {
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
    tableName: 'FIN_CodeCombination',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        name: "PK__FIN_Code__21B5C07F135BE683",
        unique: true,
        fields: [
          { name: "AcctCode" },
        ]
      },
    ]
  });
};
