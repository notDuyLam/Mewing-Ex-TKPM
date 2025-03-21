'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Seed bảng Department
    await queryInterface.bulkInsert('Departments', [
      { id: 1, name: 'Luật', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Tiếng Anh thương mại', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Khoa Tiếng Nhật', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Khoa Tiếng Pháp', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed bảng Status
    await queryInterface.bulkInsert('Statuses', [
      { id: 1, name: 'Đang học', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Đã tốt nghiệp', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Đã thôi học', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Tạm dừng học', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Seed bảng Program
    await queryInterface.bulkInsert('Programs', [
      { id: 1, name: 'Đại trà', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Chất lượng cao', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Tiên tiến', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Programs', null, {});
    await queryInterface.bulkDelete('Statuses', null, {});
    await queryInterface.bulkDelete('Departments', null, {});
  }
};
