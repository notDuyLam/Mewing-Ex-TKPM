const db = require("../../models");
const Status = db.Status;

// Tạo mới trạng thái
const createStatus = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Status name is required' });
    }

    const status = await Status.create({ name });

    return res.status(201).json({
      message: 'Status created successfully',
      data: status
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating status',
      error: error.message
    });
  }
};

// Lấy tất cả trạng thái
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll();

    return res.status(200).json(statuses);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving statuses',
      error: error.message
    });
  }
};

// Lấy trạng thái theo ID
const getStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const status = await Status.findByPk(id);

    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    return res.status(200).json({
      message: 'Status retrieved successfully',
      data: status
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving status',
      error: error.message
    });
  }
};

// Cập nhật trạng thái
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const status = await Status.findByPk(id);

    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    await status.update({ name });

    return res.status(200).json({
      message: 'Status updated successfully',
      data: status
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating status',
      error: error.message
    });
  }
};

// Xóa trạng thái
const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const status = await Status.findByPk(id);

    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    await status.destroy();

    return res.status(200).json({
      message: 'Status deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting status',
      error: error.message
    });
  }
};

module.exports = {
  createStatus,
  getAllStatuses,
  getStatus,
  updateStatus,
  deleteStatus
};