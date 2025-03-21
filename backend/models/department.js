'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Student, { foreignKey: 'departmentId' });
    }
  }
  Department.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'Departments'
  });
  return Department;
};