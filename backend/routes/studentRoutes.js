const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/api/students/:id', studentController.getStudentById);

// Create new student
router.post('/api/students', studentController.createStudent);

// Update student
router.put('/api/students/:id', studentController.updateStudent);

// Delete student
router.delete('/api/students/:id', studentController.deleteStudent);

// Search students
router.get('/api/search', studentController.searchStudents);

module.exports = router;