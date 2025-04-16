"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    static associate(models) {
      Semester.hasMany(models.Class, { foreignKey: "semesterId" });
    }
  }
  Semester.init(
    {
      year: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cancelDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Semester",
      tableName: "Semesters",
      timestamps: false,
    }
  );
  return Semester;
};
