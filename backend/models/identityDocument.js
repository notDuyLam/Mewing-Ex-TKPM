'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IdentityDocuments extends Model {
    static associate(models) {
      IdentityDocuments.belongsTo(models.Student, {
        foreignKey: 'studentId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  IdentityDocuments.init({
    studentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    identityType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    identityNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issuePlace: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    chipAttached: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    issuingCountry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'IdentityDocuments',
    tableName: 'IdentityDocuments'
  });
  return IdentityDocuments;
};