const express = require('express');
const router = express.Router();
const enrollmentController = require('./enrollment.controller');

// Định nghịa các tuyến đường
// Đăng ký lớp cho sinh viên - ClassId, StudentId
router.post('/', enrollmentController.registerClassForStudent);
// Hủy đăng ký lớp cho sinh viên - ClassId, StudentId
router.delete('/', enrollmentController.deregisterClassforStudent); 

module.exports = router;