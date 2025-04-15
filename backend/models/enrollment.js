"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.Student, { foreignKey: "studentId" });
      Enrollment.belongsTo(models.Class, { foreignKey: "classId" });
      Enrollment.belongsTo(models.Staff, { foreignKey: "registerBy" });
    }
  }
  Enrollment.init(
    {
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registerBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      registerAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
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
