const express = require('express');
const router = express.Router();

const studentController = require('./student.controller');

const upload = require('../../config/multerConfig');

//router.get('/', studentController.getAllStudents);

router.get('/:studentId', studentController.getStudentById);

router.post('/', studentController.createStudent);

router.put('/:studentId', studentController.updateStudent);

router.delete('/:studentId', studentController.deleteStudent);

router.get('/', studentController.searchStudents); // Tìm kiếm sinh viên theo các tiêu chí

// Route export
router.get('/export/csv', studentController.exportToCSV);
router.get('/export/excel', studentController.exportToExcel);

// Route import
router.post('/import', upload.single('file'), studentController.importFromFile);

module.exports = router;