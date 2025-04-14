"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Enrollments", [
      {
        name: "Enrollment 1",
        studentId: 1001,
        courseId: 1,
        registerBy: 1,
        registerAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Enrollment 2",
        studentId: 1002,
        courseId: 2,
        registerBy: 2,
        registerAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Enrollments", null, {});
  },
};
