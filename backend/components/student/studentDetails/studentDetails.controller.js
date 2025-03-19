const db = require("../../../models");
const StudentDetails = db.StudentDetails;

// Tạo mới StudentDetails
const createStudentDetails = async (req, res) => {
  try {
    const {
      studentId,
      permanentAddressHouse,
      permanentAddressWard,
      permanentAddressDistrict,
      permanentAddressCity,
      permanentAddressCountry,
      temporaryAddress,
      mailingAddress,
      nationality
    } = req.body;

    const studentDetails = await StudentDetails.create({
      studentId,
      permanentAddressHouse,
      permanentAddressWard,
      permanentAddressDistrict,
      permanentAddressCity,
      permanentAddressCountry,
      temporaryAddress,
      mailingAddress,
      nationality
    });

    return res.status(201).json({
      message: 'Student details created successfully',
      data: studentDetails
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating student details',
      error: error.message
    });
  }
};

// Lấy thông tin StudentDetails theo studentId
const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentDetails = await StudentDetails.findOne({
      where: { studentId }
    });

    if (!studentDetails) {
      return res.status(404).json({
        message: 'Student details not found'
      });
    }

    return res.status(200).json({
      message: 'Student details retrieved successfully',
      data: studentDetails
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving student details',
      error: error.message
    });
  }
};

// Cập nhật StudentDetails
const updateStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      permanentAddressHouse,
      permanentAddressWard,
      permanentAddressDistrict,
      permanentAddressCity,
      permanentAddressCountry,
      temporaryAddress,
      mailingAddress,
      nationality
    } = req.body;

    const studentDetails = await StudentDetails.findOne({
      where: { studentId }
    });

    if (!studentDetails) {
      return res.status(404).json({
        message: 'Student details not found'
      });
    }

    await studentDetails.update({
      permanentAddressHouse,
      permanentAddressWard,
      permanentAddressDistrict,
      permanentAddressCity,
      permanentAddressCountry,
      temporaryAddress,
      mailingAddress,
      nationality
    });

    return res.status(200).json({
      message: 'Student details updated successfully',
      data: studentDetails
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating student details',
      error: error.message
    });
  }
};

// Xóa StudentDetails
const deleteStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentDetails = await StudentDetails.findOne({
      where: { studentId }
    });

    if (!studentDetails) {
      return res.status(404).json({
        message: 'Student details not found'
      });
    }

    await studentDetails.destroy();

    return res.status(200).json({
      message: 'Student details deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting student details',
      error: error.message
    });
  }
};

module.exports = {
  createStudentDetails,
  getStudentDetails,
  updateStudentDetails,
  deleteStudentDetails
};