"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Staffs", [
      {
        name: "Nguyen Van A",
        department: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tran Thi B",
        department: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Le Van C",
        department: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Staffs", null, {});
  },
};
