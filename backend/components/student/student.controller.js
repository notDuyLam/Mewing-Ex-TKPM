const db = require("../../models");
const Student = db.Student;

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const getStudentById = async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const createStudent = async (req, res) => {
    try {
      const studentData = {
        studentId: req.body.studentId,
        fullName: req.body.fullName,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        departmentId: req.body.departmentId,
        course: req.body.course,
        programId: req.body.programId,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        statusId: req.body.statusId
      };
  
      const student = await Student.create(studentData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: 'Bad request', details: error.message });
    }
};

const updateStudent = async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      const updatedData = {
        fullName: req.body.fullName || student.fullName,
        dateOfBirth: req.body.dateOfBirth || student.dateOfBirth,
        gender: req.body.gender || student.gender,
        departmentId: req.body.departmentId || student.departmentId,
        course: req.body.course || student.course,
        programId: req.body.programId || student.programId,
        email: req.body.email || student.email,
        phoneNumber: req.body.phoneNumber || student.phoneNumber,
        statusId: req.body.statusId || student.statusId
      };
  
      await student.update(updatedData);
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ error: 'Bad request', details: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      await student.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};