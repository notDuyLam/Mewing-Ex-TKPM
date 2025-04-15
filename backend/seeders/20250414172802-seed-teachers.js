"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Teachers", [
      {
        teacherId: "T001", // Example teacher ID
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        teacherId: "T002", // Example teacher ID
        name: "Jane Smith",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        teacherId: "T003", // Example teacher ID
        name: "Alice Johnson",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teachers", null, {});
  },
};
