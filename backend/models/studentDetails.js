'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentDetails extends Model {
    static associate(models) {
      StudentDetails.belongsTo(models.Student, {
        foreignKey: 'studentId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  StudentDetails.init({
    studentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permanentAddressHouse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permanentAddressWard: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permanentAddressDistrict: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permanentAddressCity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permanentAddressCountry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    temporaryAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mailingAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'StudentDetails',
    tableName: 'StudentDetails'
  });
  return StudentDetails;
};