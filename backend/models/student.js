'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasOne(models.StudentDetails, {
        foreignKey: 'studentId',
        as: 'details'
      });
    }
  }
  Student.init({
    studentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    fullName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.STRING,
    department: DataTypes.STRING,
    course: DataTypes.STRING,
    program: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};