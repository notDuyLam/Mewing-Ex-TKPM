const express = require('express');
const router = express.Router();
const courseController = require('./course.controller');

// Định nghĩa các tuyến đường
// Tạo mới khóa học - courseId, courseName, credits, departmentId, description, preCourseId
router.post('/', courseController.createCourse); 
router.delete('/:courseId', courseController.deleteCourse); // Xóa khóa học
router.patch('/active/:courseId', courseController.activeCourse); // Cập nhật status khóa học sang active
router.put('/:courseId', courseController.updateCourse); 
// Cập nhật khóa học - courseName, credits, departmentId, preCourseId, description
router.get('/', courseController.getAllCourses); // Lấy tất cả khóa học
router.get('/:courseId', courseController.getCourseById); // Lấy khóa học theo ID
router.get('/:courseId/classes', courseController.getClasses); // Lấy lớp học của khóa học

module.exports = router;