"use strict";

const semester = require("../models/semester");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Classes", {
      classId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      courseId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Courses",
          key: "courseId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxStudent: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      schedule: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      room: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      teacherId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "teacherId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      semesterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Semesters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Classes");
  },
};
