"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegistrationHistory extends Model {
    static associate(models) {
      RegistrationHistory.belongsTo(models.Student, {
        foreignKey: "studentId",
      });
      RegistrationHistory.belongsTo(models.Class, { foreignKey: "classId" });
      RegistrationHistory.belongsTo(models.Staff, {
        foreignKey: "performedBy",
      });
    }
  }
  RegistrationHistory.init(
    {
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM("register", "cancel"),
        allowNull: false,
      },
      performedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      performAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      modelName: "RegistrationHistory",
      tableName: "RegistrationHistories",
    }
  );
  return RegistrationHistory;
};
