const express = require('express');
const router = express.Router();
const programController = require('./program.controller');

// Định nghĩa các tuyến đường
router.post('/', programController.createProgram); // Tạo mới chương trình
router.get('/', programController.getAllPrograms); // Lấy tất cả chương trình
router.get('/:id', programController.getProgram); // Lấy chương trình theo ID
router.put('/:id', programController.updateProgram); // Cập nhật chương trình
router.delete('/:id', programController.deleteProgram); // Xóa chương trình

module.exports = router;