const express = require('express');
const router = express.Router();
const studentDetailsController = require('./studentDetails.controller');

// Định nghĩa các tuyến đường
router.post('/', studentDetailsController.createStudentDetails); // Tạo mới StudentDetails
router.get('/:studentId', studentDetailsController.getStudentDetails); // Lấy thông tin StudentDetails theo studentId
router.put('/:studentId', studentDetailsController.updateStudentDetails); // Cập nhật StudentDetails
router.delete('/:studentId', studentDetailsController.deleteStudentDetails); // Xóa StudentDetails

module.exports = router;