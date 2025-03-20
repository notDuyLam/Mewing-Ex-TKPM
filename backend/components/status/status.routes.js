'use strict';

const express = require('express');
const router = express.Router();
const statusController = require('./status.controller');

// Định nghĩa các tuyến đường
router.post('/', statusController.createStatus); // Tạo mới trạng thái
router.get('/', statusController.getAllStatuses); // Lấy tất cả trạng thái
router.get('/:id', statusController.getStatus); // Lấy trạng thái theo ID
router.put('/:id', statusController.updateStatus); // Cập nhật trạng thái
router.delete('/:id', statusController.deleteStatus); // Xóa trạng thái

module.exports = router;