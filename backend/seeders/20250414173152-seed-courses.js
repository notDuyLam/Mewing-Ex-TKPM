"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Courses", [
      {
        name: "Web Development",
        departmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Data Structures",
        departmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Database Systems",
        departmentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null, {});
  },
};
