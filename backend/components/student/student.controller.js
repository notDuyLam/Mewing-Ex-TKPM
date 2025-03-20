const db = require("../../models");
const Student = db.Student;
const Department = db.Department;
const Status = db.Status;
const Program = db.Program;

const { Op } = require('sequelize');

const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const XLSX = require('xlsx');

const logger = require('../../log/logger');

const getStudentById = async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) {
        logger.warn('Student not found', { studentId });
        return res.status(404).json({ error: 'Student not found' });
      }
      logger.info('Student retrieved', { studentId });
      res.status(200).json(student);
    } catch (error) {
      logger.error('Error retrieving student', { error: error.message, studentId: req.params.studentId });
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
      logger.info('Student created', { studentId, fullName, user: req.user?.id || 'unknown' });
      res.status(201).json(student);
    } catch (error) {
      logger.error('Error creating student', { error: error.message, studentId: req.body.studentId });
      res.status(400).json({ error: 'Bad request', details: error.message });
    }
};

const updateStudent = async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) {
        logger.warn('Student not found for update', { studentId });
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
      logger.info('Student updated', { studentId, updatedFields: req.body, user: req.user?.id || 'unknown' });
      res.status(200).json(student);
    } catch (error) {
      logger.error('Error updating student', { error: error.message, studentId: req.params.studentId });
      res.status(400).json({ error: 'Bad request', details: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) {
        logger.warn('Student not found for deletion', { studentId });
        return res.status(404).json({ error: 'Student not found' });
      }
      await student.destroy();
      logger.info('Student deleted', { studentId, user: req.user?.id || 'unknown' });
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting student', { error: error.message, studentId: req.params.studentId });
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const searchStudents = async (req, res) => {
  try {
    const { departmentId, fullName, studentId, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    const where = {};

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (fullName) {
      where.fullName = { [Op.like]: `%${fullName}%` }; // Tìm kiếm gần đúng theo tên
    }

    if (studentId) {
      where.studentId = { [Op.like]: `%${studentId}%` }; // Tìm kiếm gần đúng theo mã số sinh viên
    }

    const totalRecords = await Student.count({ where });

    const students = await Student.findAll({
      where,
      include: [
        { model: Department, as: 'department' },
        { model: Status, as: 'status' },
        { model: Program, as: 'program' }
      ],
      limit: limitNum,
      offset: offset
    });

    if (!students || students.length === 0) {
      logger.warn('No students found in search', { filters: req.query });
      return res.status(404).json({
        message: 'No students found matching the criteria'
      });
    }

    const totalPages = Math.ceil(totalRecords / limitNum);

    logger.info('Students retrieved', { filters: req.query, totalRecords });

    return res.status(200).json({
      message: 'Students retrieved successfully',
      data: students,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum
      }
    });
  } catch (error) {
    logger.error('Error searching students', { error: error.message, filters: req.query });
    return res.status(500).json({
      message: 'Error searching students',
      error: error.message
    });
  }
};

// Export dữ liệu sang CSV
const exportToCSV = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Department, as: 'department' },
        { model: Status, as: 'status' },
        { model: Program, as: 'program' }
      ]
    });

    const data = students.map(student => ({
      studentId: student.studentId,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString().split('T')[0] : null,
      gender: student.gender,
      email: student.email,
      phoneNumber: student.phoneNumber,
      department: student.department ? student.department.name : null,
      status: student.status ? student.status.name : null,
      program: student.program ? student.program.name : null
    }));

    const csv = stringify(data, { header: true });

    logger.info('Students exported to CSV', { recordCount: students.length, user: req.user?.id || 'unknown' });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    logger.error('Error exporting to CSV', { error: error.message });
    return res.status(500).json({ error: 'Error exporting to CSV: ' + error.message });
  }
};

// Export dữ liệu sang Excel
const exportToExcel = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Department, as: 'department' },
        { model: Status, as: 'status' },
        { model: Program, as: 'program' }
      ]
    });

    const data = students.map(student => ({
      'Student ID': student.studentId,
      'Full Name': student.fullName,
      'Date of Birth': student.dateOfBirth ? student.dateOfBirth.toISOString().split('T')[0] : null,
      'Gender': student.gender,
      'Email': student.email,
      'Phone Number': student.phoneNumber,
      'Department': student.department ? student.department.name : null,
      'Status': student.status ? student.status.name : null,
      'Program': student.program ? student.program.name : null
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    logger.info('Students exported to Excel', { recordCount: students.length, user: req.user?.id || 'unknown' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');
    return res.status(200).send(buffer);
  } catch (error) {
    logger.error('Error exporting to Excel', { error: error.message });
    return res.status(500).json({ error: 'Error exporting to Excel: ' + error.message });
  }
};

// Import dữ liệu từ file (CSV hoặc Excel)
const importFromFile = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn('No file uploaded for import');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    let studentsData;

    if (file.mimetype === 'text/csv') {
      // Xử lý file CSV
      studentsData = parse(file.buffer.toString(), { columns: true, trim: true });
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Xử lý file Excel
      const wb = XLSX.read(file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      studentsData = XLSX.utils.sheet_to_json(ws);
    } else {
      logger.warn('Unsupported file format for import', { mimetype: file.mimetype });
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Lấy danh sách departments, statuses, programs để ánh xạ
    const departments = await Department.findAll();
    const statuses = await Status.findAll();
    const programs = await Program.findAll();

    const departmentMap = new Map(departments.map(d => [d.name, d.id]));
    const statusMap = new Map(statuses.map(s => [s.name, s.id]));
    const programMap = new Map(programs.map(p => [p.name, p.id]));

    // Xử lý từng bản ghi
    for (const student of studentsData) {
      const studentData = {
        studentId: student.studentId || student['Student ID'],
        fullName: student.fullName || student['Full Name'],
        dateOfBirth: student.dateOfBirth || student['Date of Birth'] || null,
        gender: student.gender || student['Gender'] || null,
        email: student.email || student['Email'] || null,
        phoneNumber: student.phoneNumber || student['Phone Number'] || null,
        departmentId: departmentMap.get(student.department || student['Department']) || null,
        statusId: statusMap.get(student.status || student['Status']) || null,
        programId: programMap.get(student.program || student['Program']) || null
      };

      // Thêm hoặc cập nhật sinh viên
      await Student.upsert(studentData);
    }

    logger.info('Students import completed', { totalRecords: validStudents.length, user: req.user?.id || 'unknown' });
    return res.status(200).json({ message: 'Students imported successfully' });
  } catch (error) {
    logger.error('Error importing students', { error: error.message, file: req.file?.originalname });
    return res.status(500).json({ error: 'Error importing students: ' + error.message });
  }
};

module.exports = {
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    exportToCSV,
    exportToExcel,
    importFromFile,
};