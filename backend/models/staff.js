"use strict";
const { Model } = require("sequelize");
// const department = require('./department');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    // TODO: WILL UPDATE LATER
    static associate(models) {
      Staff.hasMany(models.Enrollment, { foreignKey: "staffId" });
    }
  }
  Staff.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      department: {
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
