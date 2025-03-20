'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Students', 'departmentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Departments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('Students', 'statusId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Statuses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('Students', 'programId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Programs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.removeColumn('Students', 'department');
    await queryInterface.removeColumn('Students', 'status');
    await queryInterface.removeColumn('Students', 'program');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Students', 'department', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Students', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Students', 'program', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.removeColumn('Students', 'departmentId');
    await queryInterface.removeColumn('Students', 'statusId');
    await queryInterface.removeColumn('Students', 'programId');
  }
};
