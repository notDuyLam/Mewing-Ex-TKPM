require("dotenv").config();
const db = require("../../models");
const Student = db.Student;
const Department = db.Department;
const Status = db.Status;
const Program = db.Program;
const Enrollment = db.Enrollment;
const StudentDetails = db.StudentDetails;
const IdentityDocuments = db.IdentityDocuments;
const Course = db.Course;
const Class = db.Class;
const Semester = db.Semester;
const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;

function validateEmailDomain(email) {
  const emailDomain = email.split("@")[1];
  return emailDomain === allowedDomain;
}
function validationPhoneNumber(phoneNumber) {
  const allowedPhoneNumbers = JSON.parse(process.env.ALLOWED_PHONE_NUMBERS);
  for (let i = 0; i < allowedPhoneNumbers.length; i++) {
    if (new RegExp(allowedPhoneNumbers[i].regex).test(phoneNumber)) {
      return true;
    }
  }
  return false;
}

const { Op } = require("sequelize");

const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const XLSX = require("xlsx");

const logger = require("../../log/logger");
const { error } = require("winston");

const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findByPk(studentId);
    if (!student) {
      logger.warn("Student not found", { studentId });
      return res.status(404).json({ error: "Student not found" });
    }
    logger.info("Student retrieved", { studentId });
    res.status(200).json(student);
  } catch (error) {
    logger.error("Error retrieving student", {
      error: error.message,
      studentId: req.params.studentId,
    });
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      dateOfBirth,
      gender,
      departmentId,
      course,
      programId,
      email,
      phoneNumber,
      statusId,
    } = req.body;

    // Kiểm tra xem studentId đã tồn tại chưa
    const existingStudent = await Student.findOne({ where: { studentId } });

    if (existingStudent) {
      logger.warn("Student ID already exists", { studentId });
      return res.status(409).json({ error: "Student ID already exists" });
    }

    if (!validateEmailDomain(email)) {
      return res
        .status(400)
        .json({ message: `Email phải thuộc tên miền @${allowedDomain}` });
    }

    if (!validationPhoneNumber(phoneNumber)) {
      const allowedCountries = JSON.parse(
        process.env.ALLOWED_PHONE_NUMBERS
      ).map((e) => e.name);
      logger.warn("Invalid phone number", { studentId });
      return res.status(400).json({
        message: `Số điện thoại không hợp lệ hoặc không thuộc vùng: ${allowedCountries.join(
          ", "
        )}`,
      });
    }

    const studentData = {
      studentId,
      fullName,
      dateOfBirth,
      gender,
      departmentId,
      course,
      programId,
      email,
      phoneNumber,
      statusId,
    };

    const student = await Student.create(studentData);
    logger.info("Student created", {
      studentId,
      fullName,
      user: req.user?.id || "unknown",
    });

    res.status(201).json(student);
  } catch (error) {
    logger.error("Error creating student", {
      error: error.message,
      studentId: req.body.studentId,
    });
    res.status(400).json({ error: "Bad request", details: error.message });
  }
};

const verifyStudentStatus = async (studentId, newStatusId) => {
  try {
    const newStatus = await Status.findByPk(newStatusId);
    if (!newStatus) {
      return { valid: false, message: "Status not found" };
    }

    const student = await Student.findByPk(studentId, {
      include: [{ model: Status, as: "status" }],
    });

    if (!student) {
      return { valid: false, message: "Student not found" };
    }

    const currentStatusName = student.status ? student.status.name : null;
    const newStatusName = newStatus.name;

    // Check invalid status changes
    if (
      (currentStatusName === "Bảo lưu" ||
        currentStatusName === "Tốt nghiệp" ||
        currentStatusName === "Đình chỉ") &&
      newStatusName === "Đang học"
    ) {
      return {
        valid: false,
        message: "Thay đổi tình trạng sinh viên không hợp lệ",
      };
    }

    return { valid: true };
  } catch (error) {
    logger.error("Error verifying student status", { error: error.message });
    return { valid: false, message: "Error verifying status" };
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findByPk(req.params.studentId);
    if (!student) {
      logger.warn("Student not found for update", { studentId });
      return res.status(404).json({ error: "Student not found" });
    }

    const statusValidation = await verifyStudentStatus(
      studentId,
      req.body.statusId
    );
    if (!statusValidation.valid) {
      logger.warn("Invalid status change", {
        studentId,
        currentStatusId: student.statusId,
        requestedStatusId: req.body.statusId,
        message: statusValidation.message,
      });
      return res.status(400).json({ message: statusValidation.message });
    }

    // Get email from request body or existing student data
    const email = req.body.email || student.email;

    const updatedData = {
      fullName: req.body.fullName || student.fullName,
      dateOfBirth: req.body.dateOfBirth || student.dateOfBirth,
      gender: req.body.gender || student.gender,
      departmentId: req.body.departmentId || student.departmentId,
      course: req.body.course || student.course,
      programId: req.body.programId || student.programId,
      email: req.body.email || student.email,
      phoneNumber: req.body.phoneNumber || student.phoneNumber,
      statusId: req.body.statusId || student.statusId,
    };

    if (!validationPhoneNumber(updatedData.phoneNumber)) {
      const allowedCountries = JSON.parse(
        process.env.ALLOWED_PHONE_NUMBERS
      ).map((e) => e.name);
      logger.warn("Invalid phone number", { studentId });
      return res.status(400).json({
        message: `Số điện thoại không hợp lệ hoặc không thuộc vùng: ${allowedCountries.join(
          ", "
        )}`,
      });
    }

    if (!validateEmailDomain(email)) {
      return res
        .status(400)
        .json({ message: `Email phải thuộc tên miền @${allowedDomain}` });
    }

    await student.update(updatedData);
    logger.info("Student updated", {
      studentId,
      updatedFields: req.body,
      user: req.user?.id || "unknown",
    });
    res.status(200).json(student);
  } catch (error) {
    logger.error("Error updating student", {
      error: error.message,
      studentId: req.params.studentId,
    });
    res.status(400).json({ error: "Bad request", details: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findByPk(studentId);
    if (!student) {
      logger.warn("Student not found for deletion", { studentId });
      return res.status(404).json({ error: "Student not found" });
    }
    await student.destroy();
    logger.info("Student deleted", {
      studentId,
      user: req.user?.id || "unknown",
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting student", {
      error: error.message,
      studentId: req.params.studentId,
    });
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const searchStudents = async (req, res) => {
  try {
    const {
      departmentId,
      fullName,
      studentId,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    const where = {};

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (fullName) {
      where.fullName = { [Op.iLike]: `%${fullName}%` }; // Tìm kiếm gần đúng theo tên
    }

    if (studentId) {
      where.studentId = { [Op.like]: `%${studentId}%` }; // Tìm kiếm gần đúng theo mã số sinh viên
    }

    const totalRecords = await Student.count({ where });

    const students = await Student.findAll({
      where,
      include: [
        { model: Department, as: "department" },
        { model: Status, as: "status" },
        { model: Program, as: "program" },
      ],
      limit: limitNum,
      offset: offset,
      order: [["studentId", "ASC"]],
    });

    if (!students || students.length === 0) {
      logger.warn("No students found in search", { filters: req.query });
      return res.status(404).json({
        message: "No students found matching the criteria",
      });
    }

    const totalPages = Math.ceil(totalRecords / limitNum);

    logger.info("Students retrieved", { filters: req.query, totalRecords });

    return res.status(200).json({
      message: "Students retrieved successfully",
      data: students,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
      },
    });
  } catch (error) {
    logger.error("Error searching students", {
      error: error.message,
      filters: req.query,
    });
    return res.status(500).json({
      message: "Error searching students",
      error: error.message,
    });
  }
};
// Export dữ liệu sang CSV
const exportToCSV = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Department, as: "department" },
        { model: Status, as: "status" },
        { model: Program, as: "program" },
        { model: StudentDetails, as: "details" },
        { model: IdentityDocuments, as: "identityDocuments" },
      ],
      order: [["studentId", "ASC"]],
    });

    students.map((student) => {
      if (student.identityDocuments) {
        student.identityDocuments = student.identityDocuments[0];
      }
      return student;
    });

    const data = students.map((student) => ({
      studentId: student.studentId,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.toISOString().split("T")[0]
        : null,
      gender: student.gender,
      email: student.email,
      course: student.course,
      phoneNumber: student.phoneNumber,
      department: student.department ? student.department.name : null,
      status: student.status ? student.status.name : null,
      program: student.program ? student.program.name : null,
      permanentAddressHouse: student.details
        ? student.details.permanentAddressHouse
        : null,
      permanentAddressWard: student.details
        ? student.details.permanentAddressWard
        : null,
      permanentAddressDistrict: student.details
        ? student.details.permanentAddressDistrict
        : null,
      permanentAddressCity: student.details
        ? student.details.permanentAddressCity
        : null,
      permanentAddressCountry: student.details
        ? student.details.permanentAddressCountry
        : null,
      temporaryAddress: student.details
        ? student.details.temporaryAddress
        : null,
      mailingAddress: student.details ? student.details.mailingAddress : null,
      nationality: student.details ? student.details.nationality : null,
      identityType: student.identityDocuments
        ? student.identityDocuments.identityType
        : null,
      identityNumber: student.identityDocuments
        ? student.identityDocuments.identityNumber
        : null,
      issueDate:
        student.identityDocuments && student.identityDocuments.issueDate
          ? student.identityDocuments.issueDate.toISOString().split("T")[0]
          : null,
      issuePlace: student.identityDocuments
        ? student.identityDocuments.issuePlace
        : null,
      expiryDate:
        student.identityDocuments && student.identityDocuments.expiryDate
          ? student.identityDocuments.expiryDate.toISOString().split("T")[0]
          : null,
      chipAttached: student.identityDocuments
        ? student.identityDocuments.chipAttached
        : null,
      issuingCountry: student.identityDocuments
        ? student.identityDocuments.issuingCountry
        : null,
      note: student.identityDocuments ? student.identityDocuments.note : null,
    }));

    const csv = stringify(data, { header: true });

    logger.info("Students exported to CSV", {
      recordCount: students.length,
      user: req.user?.id || "unknown",
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="students.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    logger.error("Error exporting to CSV", { error: error.message });
    return res
      .status(500)
      .json({ error: "Error exporting to CSV: " + error.message });
  }
};

// Export dữ liệu sang Excel
const exportToExcel = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Department, as: "department" },
        { model: Status, as: "status" },
        { model: Program, as: "program" },
        { model: StudentDetails, as: "details" },
        { model: IdentityDocuments, as: "identityDocuments" },
      ],
    });

    students.map((student) => {
      if (student.identityDocuments) {
        student.identityDocuments = student.identityDocuments[0];
      }
      return student;
    });

    const data = students.map((student) => ({
      "Student ID": student.studentId,
      "Full Name": student.fullName,
      "Date of Birth": student.dateOfBirth
        ? student.dateOfBirth.toISOString().split("T")[0]
        : null,
      Gender: student.gender,
      Email: student.email,
      Course: student.course,
      "Phone Number": student.phoneNumber,
      Department: student.department ? student.department.name : null,
      Status: student.status ? student.status.name : null,
      Program: student.program ? student.program.name : null,
      "Permanent Address House": student.details
        ? student.details.permanentAddressHouse
        : null,
      "Permanent Address Ward": student.details
        ? student.details.permanentAddressWard
        : null,
      "Permanent Address District": student.details
        ? student.details.permanentAddressDistrict
        : null,
      "Permanent Address City": student.details
        ? student.details.permanentAddressCity
        : null,
      "Permanent Address Country": student.details
        ? student.details.permanentAddressCountry
        : null,
      "Temporary Address": student.details
        ? student.details.temporaryAddress
        : null,
      "Mailing Address": student.details
        ? student.details.mailingAddress
        : null,
      Nationality: student.details ? student.details.nationality : null,
      "Identity Type": student.identityDocuments
        ? student.identityDocuments.identityType
        : null,
      "Identity Number": student.identityDocuments
        ? student.identityDocuments.identityNumber
        : null,
      "Issue Date":
        student.identityDocuments && student.identityDocuments.issueDate
          ? student.identityDocuments.issueDate.toISOString().split("T")[0]
          : null,
      "Issue Place": student.identityDocuments
        ? student.identityDocuments.issuePlace
        : null,
      "Expiry Date":
        student.identityDocuments && student.identityDocuments.expiryDate
          ? student.identityDocuments.expiryDate.toISOString().split("T")[0]
          : null,
      "Chip Attached": student.identityDocuments
        ? student.identityDocuments.chipAttached
        : null,
      "Issuing Country": student.identityDocuments
        ? student.identityDocuments.issuingCountry
        : null,
      Note: student.identityDocuments ? student.identityDocuments.note : null,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    logger.info("Students exported to Excel", {
      recordCount: students.length,
      user: req.user?.id || "unknown",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students.xlsx"'
    );
    return res.status(200).send(buffer);
  } catch (error) {
    logger.error("Error exporting to Excel", { error: error.message });
    return res
      .status(500)
      .json({ error: "Error exporting to Excel: " + error.message });
  }
};

// Import dữ liệu từ file
const importFromFile = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn("No file uploaded for import");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    let studentsData;

    if (file.mimetype === "text/csv") {
      studentsData = parse(file.buffer.toString(), {
        columns: true,
        trim: true,
      });
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const wb = XLSX.read(file.buffer, { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      studentsData = XLSX.utils.sheet_to_json(ws);
    } else {
      logger.warn("Unsupported file format for import", {
        mimetype: file.mimetype,
      });
      return res.status(400).json({ error: "Unsupported file format" });
    }

    // Lấy danh sách departments, statuses, programs để ánh xạ
    const departments = await Department.findAll();
    const statuses = await Status.findAll();
    const programs = await Program.findAll();

    const departmentMap = new Map(departments.map((d) => [d.name, d.id]));
    const statusMap = new Map(statuses.map((s) => [s.name, s.id]));
    const programMap = new Map(programs.map((p) => [p.name, p.id]));

    // Xử lý từng bản ghi
    for (const student of studentsData) {
      const studentData = {
        studentId: student.studentId || student["Student ID"],
        fullName: student.fullName || student["Full Name"],
        dateOfBirth: student.dateOfBirth || student["Date of Birth"] || null,
        gender: student.gender || student["Gender"] || null,
        email: student.email || student["Email"] || null,
        course: student.course || student["Course"] || null,
        phoneNumber: student.phoneNumber || student["Phone Number"] || null,
        departmentId: null, // Sẽ được gán sau khi xử lý
        statusId: null, // Sẽ được gán sau khi xử lý
        programId: null, // Sẽ được gán sau khi xử lý
      };

      // Xử lý Department
      const departmentName = student.department || student["Department"];
      if (departmentName) {
        let departmentId = departmentMap.get(departmentName);
        if (!departmentId) {
          const newDepartment = await Department.create({
            name: departmentName,
          });
          departmentId = newDepartment.id;
          departmentMap.set(departmentName, departmentId); // Cập nhật Map
        }
        studentData.departmentId = departmentId;
      }

      // Xử lý Status
      const statusName = student.status || student["Status"];
      if (statusName) {
        let statusId = statusMap.get(statusName);
        if (!statusId) {
          const newStatus = await Status.create({ name: statusName });
          statusId = newStatus.id;
          statusMap.set(statusName, statusId); // Cập nhật Map
        }
        studentData.statusId = statusId;
      }

      // Xử lý Program
      const programName = student.program || student["Program"];
      if (programName) {
        let programId = programMap.get(programName);
        if (!programId) {
          const newProgram = await Program.create({ name: programName });
          programId = newProgram.id;
          programMap.set(programName, programId); // Cập nhật Map
        }
        studentData.programId = programId;
      }

      const detailsData = {
        studentId: studentData.studentId,
        permanentAddressHouse:
          student.permanentAddressHouse ||
          student["Permanent Address House"] ||
          null,
        permanentAddressWard:
          student.permanentAddressWard ||
          student["Permanent Address Ward"] ||
          null,
        permanentAddressDistrict:
          student.permanentAddressDistrict ||
          student["Permanent Address District"] ||
          null,
        permanentAddressCity:
          student.permanentAddressCity ||
          student["Permanent Address City"] ||
          null,
        permanentAddressCountry:
          student.permanentAddressCountry ||
          student["Permanent Address Country"] ||
          null,
        temporaryAddress:
          student.temporaryAddress || student["Temporary Address"] || null,
        mailingAddress:
          student.mailingAddress || student["Mailing Address"] || null,
        nationality: student.nationality || student["Nationality"] || null,
      };

      const identityData = {
        studentId: studentData.studentId,
        identityType: student.identityType || student["Identity Type"] || null,
        identityNumber:
          student.identityNumber || student["Identity Number"] || null,
        issueDate: student.issueDate || student["Issue Date"] || null,
        issuePlace: student.issuePlace || student["Issue Place"] || null,
        expiryDate: student.expiryDate || student["Expiry Date"] || null,
        chipAttached: student.chipAttached || student["Chip Attached"] || null,
        issuingCountry:
          student.issuingCountry || student["Issuing Country"] || null,
        note: student.note || student["Note"] || null,
      };

      // Thêm hoặc cập nhật sinh viên
      await Student.upsert(studentData);

      // Kiểm tra và xử lý StudentDetails
      if (
        Object.values(detailsData).some((val) => val !== null && val !== "")
      ) {
        const existingDetails = await StudentDetails.findOne({
          where: { studentId: detailsData.studentId },
        });
        if (existingDetails) {
          await existingDetails.update(detailsData);
        } else {
          await StudentDetails.create(detailsData);
        }
      }

      // Kiểm tra và xử lý IdentityDocuments
      if (identityData.identityType) {
        const existingIdentity = await IdentityDocuments.findOne({
          where: { studentId: identityData.studentId },
        });
        if (existingIdentity) {
          await existingIdentity.update(identityData);
        } else {
          await IdentityDocuments.create(identityData);
        }
      }
    }

    logger.info("Students import completed", {
      totalRecords: studentsData.length,
      user: req.user?.id || "unknown",
    });
    return res.status(200).json({ message: "Students imported successfully" });
  } catch (error) {
    logger.error("Error importing students", {
      error: error.message,
      file: req.file?.originalname,
    });
    return res
      .status(500)
      .json({ error: "Error importing students: " + error.message });
  }
};

const getReport = async (req, res) => {
  try {
    const {studentId} = req.params;
    const student = await Student.findByPk(studentId, {
        include: [
            { model: Department, as: "department" },
            { model: Status, as: "status" },
            { model: Program, as: "program" },
        ]
    });
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    const grades = await Enrollment.findAll({ where: { studentId: studentId },
        include: [
            {model: Class, as: "Class", include: [
                {model: Semester, as: "Semester"},
                {model: Course, as: "Course"}
            ]},
        ]
    });

    const report = {
        student,
        grades
    };
    res.status(200).json(report);
  }catch (error) {
    logger.error("Error retrieving report", {
      studentId: req.params.studentId,
      error: error.message,
    });
    res.status(500).json({ error: "Error retrieving report: " + error.message });
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
  validateEmailDomain,
  validationPhoneNumber,
  getReport,
};
