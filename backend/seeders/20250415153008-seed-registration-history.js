"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("RegistrationHistories", [
      {
        studentId: "SV003", // Example student ID
        classId: "C001", // Example class ID
        action: "register", // Register action
        performedBy: 1, // Staff ID who performed the action
        performAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: "SV002", // Example student ID
        classId: "C002", // Example class ID
        action: "register", // Register action
        performedBy: 2, // Staff ID who performed the action
        performAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: "SV001", // Example student ID
        classId: "C002", // Example class ID
        action: "cancel", // Cancel action
        performedBy: 1, // Staff ID who performed the action
        performAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RegistrationHistories", null, {});
  },
};
