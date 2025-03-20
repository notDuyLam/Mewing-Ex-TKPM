const db = require("../../models");
const Program = db.Program;

// Tạo mới chương trình
const createProgram = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Program name is required' });
    }

    const program = await Program.create({ name });

    return res.status(201).json({
      message: 'Program created successfully',
      data: program
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating program',
      error: error.message
    });
  }
};

// Lấy tất cả chương trình
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll();

    return res.status(200).json({
      message: 'Programs retrieved successfully',
      data: programs
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving programs',
      error: error.message
    });
  }
};

// Lấy chương trình theo ID
const getProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    return res.status(200).json({
      message: 'Program retrieved successfully',
      data: program
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving program',
      error: error.message
    });
  }
};

// Cập nhật chương trình
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    await program.update({ name });

    return res.status(200).json({
      message: 'Program updated successfully',
      data: program
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating program',
      error: error.message
    });
  }
};

// Xóa chương trình
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    await program.destroy();

    return res.status(200).json({
      message: 'Program deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting program',
      error: error.message
    });
  }
};

module.exports = {
  createProgram,
  getAllPrograms,
  getProgram,
  updateProgram,
  deleteProgram
};