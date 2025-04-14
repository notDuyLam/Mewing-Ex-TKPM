"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.Course, { foreignKey: "courseId" });
      Enrollment.belongsTo(models.Student, { foreignKey: "studentId" });
      Enrollment.belongsTo(models.Staff, { foreignKey: "registerBy" });
    }
  }
  Enrollment.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      registerBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      registerAt: {
        type: DataTypes.DATE,
      },
      grade: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "Enrollment",
      tableName: "Enrollments",
    }
  );
  return Enrollment;
};
