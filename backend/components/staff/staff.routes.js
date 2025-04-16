const express = require('express');
const router = express.Router();
const staffController = require('./staff.controller');

// Định nghịa các tuyến đường
// Tạo mới giáo vụ - staffId, name
router.post('/', staffController.createStaff);
// Cập nhật thông tin giáo vụ
router.put('/:staffId', staffController.updateStaff);
// Xóa giáo vụ
router.delete('/:staffId', staffController.deleteStaff);
// Lấy danh sách giáo vụ
router.get('/', staffController.getAllStaffs);
// Lấy thông tin giáo vụ theo ID
router.get('/:staffId', staffController.getStaffById);

module.exports = router;