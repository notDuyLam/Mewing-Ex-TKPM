"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.hasMany(models.Class, { foreignKey: "teacherId" });
    }
  }
  Teacher.init(
    {
      teacherId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Teacher",
      tableName: "Teachers",
    }
  );
  return Teacher;
};
