const express = require('express');
const router = express.Router();
const departmentController = require('./department.controller');

// Định nghĩa các tuyến đường
router.post('/', departmentController.createDepartment); // Tạo mới khoa
router.get('/', departmentController.getAllDepartments); // Lấy tất cả khoa
router.get('/:id', departmentController.getDepartment); // Lấy khoa theo ID
router.put('/:id', departmentController.updateDepartment); // Cập nhật khoa
router.delete('/:id', departmentController.deleteDepartment); // Xóa khoa

module.exports = router;