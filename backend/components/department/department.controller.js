const db = require("../../models");
const Department = db.Department;

// Tạo mới khoa
const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const department = await Department.create({ name });

    return res.status(201).json({
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating department',
      error: error.message
    });
  }
};

// Lấy tất cả khoa
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();

    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving departments',
      error: error.message
    });
  }
};

// Lấy khoa theo ID
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.status(200).json({
      message: 'Department retrieved successfully',
      data: department
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving department',
      error: error.message
    });
  }
};

// Cập nhật khoa
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.update({ name });

    return res.status(200).json({
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating department',
      error: error.message
    });
  }
};

// Xóa khoa
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.destroy();

    return res.status(200).json({
      message: 'Department deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting department',
      error: error.message
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
};