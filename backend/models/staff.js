"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate(models) {
      Staff.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "Department",
      });

      Staff.hasMany(models.Enrollment, {
        foreignKey: "staffId",
        as: "Enrollments",
      });
    }
  }
  Staff.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Staff",
      tableName: "Staffs",
    }
  );
  return Staff;
};
