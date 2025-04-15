"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Courses", {
      courseId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preCourseId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Courses",
          key: "courseId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("Courses");
  },
};
