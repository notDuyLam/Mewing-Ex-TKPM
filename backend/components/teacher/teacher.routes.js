const express = require('express');
const router = express.Router();
const teacherController = require('./teacher.controller');

// Định nghịa các tuyến đường
// Tạo mới giáo viên - teacherId, name
router.post('/', teacherController.createTeacher);
// Cập nhật thông tin giáo viên
router.put('/:teacherId', teacherController.updateTeacher);
// Xóa giáo viên
router.delete('/:teacherId', teacherController.deleteTeacher);
// Lấy danh sách giáo viên
router.get('/', teacherController.getAllTeachers);
// Lấy thông tin giáo viên theo ID
router.get('/:teacherId', teacherController.getTeacherById);

module.exports = router;