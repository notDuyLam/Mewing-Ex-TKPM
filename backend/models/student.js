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
      Student.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
      Student.belongsTo(models.Status, { foreignKey: 'statusId', as: 'status' });
      Student.belongsTo(models.Program, { foreignKey: 'programId', as: 'program' });
      Student.hasOne(models.StudentDetails, { foreignKey: 'studentId', as: 'details' });
      Student.hasMany(models.IdentityDocuments, { foreignKey: 'studentId', as: 'identityDocuments' });
    }
  }
  Student.init({
    studentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    course: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};