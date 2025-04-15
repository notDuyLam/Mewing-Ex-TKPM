"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RegistrationHistories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      studentId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Students",
          key: "studentId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      classId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Classes",
          key: "classId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM("register", "cancel"),
        allowNull: false,
      },
      performedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Staffs",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      performAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("RegistrationHistories");
  },
};
