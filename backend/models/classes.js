"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Course, { foreignKey: "courseId" });
      Class.belongsTo(models.Teacher, { foreignKey: "teacherId" });
      Class.hasMany(models.Enrollment, { foreignKey: "classId" });
    }
  }
  Class.init(
    {
      classId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxStudent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      room: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teacherId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      semesterId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Class",
      tableName: "Classes",
    }
  );
  return Class;
};
