const express = require('express');
const router = express.Router();

const studentController = require('./student.controller');

router.get('/', studentController.getAllStudents);

router.get('/:studentId', studentController.getStudentById);

router.post('/', studentController.createStudent);

router.put('/:studentId', studentController.updateStudent);

router.delete('/:studentId', studentController.deleteStudent);

module.exports = router;