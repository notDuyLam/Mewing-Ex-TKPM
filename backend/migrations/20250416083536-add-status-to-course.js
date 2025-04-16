"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Courses", "status", {
      type: Sequelize.ENUM("activate", "deactivate"),
      allowNull: false,
      defaultValue: "activate", // tránh lỗi khi có dữ liệu cũ
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Courses", "status");

    // Cần xóa ENUM type khỏi Postgres nếu bạn dùng nó
    if (queryInterface.sequelize.options.dialect === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Courses_status";'
      );
    }
  },
};
