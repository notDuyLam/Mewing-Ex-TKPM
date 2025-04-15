"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Students", "course");
  },

  async down(queryInterface, Sequelize) {
    // Nếu rollback thì thêm lại cột `course`
    await queryInterface.addColumn("Students", "course", {
      type: Sequelize.STRING,
    });
  },
};
