'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('StudentDetails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      studentId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Students', // Liên kết với bảng Students
          key: 'studentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permanentAddressHouse: {
        type: Sequelize.STRING,
        allowNull: true // Số nhà, tên đường
      },
      permanentAddressWard: {
        type: Sequelize.STRING,
        allowNull: true // Phường/Xã
      },
      permanentAddressDistrict: {
        type: Sequelize.STRING,
        allowNull: true // Quận/Huyện
      },
      permanentAddressCity: {
        type: Sequelize.STRING,
        allowNull: true // Tỉnh/Thành phố
      },
      permanentAddressCountry: {
        type: Sequelize.STRING,
        allowNull: true // Quốc gia
      },
      temporaryAddress: {
        type: Sequelize.STRING,
        allowNull: true // Địa chỉ tạm trú
      },
      mailingAddress: {
        type: Sequelize.STRING,
        allowNull: true // Địa chỉ nhận thư
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true // Quốc tịch
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('StudentDetails');
  }
};
