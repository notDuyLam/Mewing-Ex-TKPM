const express = require('express');
const router = express.Router();
const classController = require('./class.controller');

// Định nghĩa các tuyến đường
// Tạo mới lớp học - classId, courseId, year, semesterId, teacherId, maxStudent, schedule, room
router.post('/', classController.createClass); 
router.get('/', classController.getAllClasses); // Lấy tất cả lớp học
router.get('/:classId', classController.getClassById); // Lấy lớp học theo ID
router.get('/:classId/students', classController.getStudents); // Lấy số sinh viên trong lớp học
// Cập nhật lớp học - year, semesterId, teacherId, maxStudent, schedule, room
router.put('/:classId', classController.updateClass); 

module.exports = router;