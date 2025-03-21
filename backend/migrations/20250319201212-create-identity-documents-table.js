'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IdentityDocuments', {
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
      identityType: {
        type: Sequelize.STRING, // "CMND", "CCCD", "Passport"
        allowNull: false
      },
      identityNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      issueDate: {
        type: Sequelize.DATE,
        allowNull: true // Ngày cấp
      },
      issuePlace: {
        type: Sequelize.STRING,
        allowNull: true // Nơi cấp
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true // Ngày hết hạn
      },
      chipAttached: {
        type: Sequelize.BOOLEAN,
        allowNull: true, // Có gắn chip (CCCD)
        defaultValue: false
      },
      issuingCountry: {
        type: Sequelize.STRING,
        allowNull: true // Quốc gia cấp (Passport)
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true // Ghi chú (Passport)
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IdentityDocuments');
  }
};