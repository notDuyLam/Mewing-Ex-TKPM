"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Staffs", [
      {
        name: "Mark Davis",
        departmentId: 1, // Example department ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah Lee",
        departmentId: 2, // Example department ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "James Brown",
        departmentId: 1, // Example department ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Staffs", null, {});
  },
};
