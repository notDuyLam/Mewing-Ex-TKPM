"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Department, { foreignKey: "departmentId" });
      Course.hasMany(models.Class, { foreignKey: "courseId" });
      Course.belongsTo(models.Course, {
        foreignKey: "preCourseId",
        as: "PreRequisite",
      });
    }
  }
  Course.init(
    {
      courseId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      credits: {
        type: DataTypes.INT,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preCourseId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "Courses",
      timestamps: true,
    }
  );
  return Course;
};
