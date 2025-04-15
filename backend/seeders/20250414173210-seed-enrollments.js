"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Enrollments", [
      {
        studentId: "SV003", // Example student ID
        classId: "C001", // Example class ID
        registerBy: 1, // Staff who registers this enrollment
        registerAt: new Date(),
        grade: null, // No grade assigned yet
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: "SV002", // Example student ID
        classId: "C002", // Example class ID
        registerBy: 2, // Staff who registers this enrollment
        registerAt: new Date(),
        grade: null, // No grade assigned yet
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Enrollments", null, {});
  },
};
