"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Classes", [
      {
        classId: "C001", // Example class ID
        courseId: "CSE101", // Example course ID
        year: 2025,
        maxStudent: 30,
        schedule: "09:00:00", // Time format (HH:MM:SS)
        room: "Room A101",
        teacherId: "T001", // Assign Teacher (FK from Teachers table)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        classId: "C002", // Example class ID
        courseId: "CSE102", // Example course ID
        year: 2025,
        maxStudent: 25,
        schedule: "11:00:00", // Time format (HH:MM:SS)
        room: "Room B202",
        teacherId: "T002", // Assign Teacher (FK from Teachers table)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Classes", null, {});
  },
};
