"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Semesters", [
      {
        year: new Date("2024-01-01"),
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-12-15"),
        cancelDeadline: new Date("2024-09-15"),
      },
      {
        year: new Date("2025-01-01"),
        startDate: new Date("2025-01-10"),
        endDate: new Date("2025-05-30"),
        cancelDeadline: new Date("2025-02-10"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Semesters", null, {});
  },
};
