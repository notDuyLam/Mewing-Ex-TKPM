const express = require('express');
const router = express.Router();
const semesterController = require('./semester.controller');

// Định nghịa các tuyến đường
// Tạo mới học kỳ -  year, startDate, endDate, cancelDeadline
router.post('/', semesterController.createSemester);
// Cập nhật thông tin học kỳ
router.put('/:semesterId', semesterController.updateSemester);
// Xóa học kỳ
router.delete('/:semesterId', semesterController.deleteSemester);
// Lấy danh sách học kỳ
router.get('/', semesterController.getAllSemesters);
// Lấy thông tin học kỳ theo ID
router.get('/:semesterId', semesterController.getSemesterById);

module.exports = router;