"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Courses", [
      {
        courseId: "CSE101",
        courseName: "Introduction to Computer Science",
        credits: 3,
        departmentId: 1, // Example department ID
        description: "A basic course to introduce computer science concepts.",
        preCourseId: null, // No prerequisite for this course
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseId: "CSE102",
        courseName: "Data Structures",
        credits: 4,
        departmentId: 1, // Example department ID
        description: "Study of fundamental data structures and algorithms.",
        preCourseId: "CSE101", // Prerequisite course
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null, {});
  },
};
