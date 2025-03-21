const express = require('express');
const router = express.Router();
const identityDocumentsController = require('./identityDocuments.controller');

// Định nghĩa các tuyến đường
router.post('/', identityDocumentsController.createIdentityDocument); // Tạo mới IdentityDocuments
router.get('/:id', identityDocumentsController.getIdentityDocument); // Lấy IdentityDocuments theo ID
router.get('/student/:studentId', identityDocumentsController.getIdentityDocumentsByStudent); // Lấy tất cả IdentityDocuments của một sinh viên
router.put('/:id', identityDocumentsController.updateIdentityDocument); // Cập nhật IdentityDocuments
router.delete('/:id', identityDocumentsController.deleteIdentityDocument); // Xóa IdentityDocuments

module.exports = router;