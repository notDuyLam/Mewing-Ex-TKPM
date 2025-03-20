const db = require("../../../models");
const IdentityDocuments = db.IdentityDocuments;

// Tạo mới IdentityDocuments
const createIdentityDocument = async (req, res) => {
  try {
    const {
      studentId,
      identityType,
      identityNumber,
      issueDate,
      issuePlace,
      expiryDate,
      chipAttached,
      issuingCountry,
      note
    } = req.body;

    const identityDocument = await IdentityDocuments.create({
      studentId,
      identityType,
      identityNumber,
      issueDate,
      issuePlace,
      expiryDate,
      chipAttached,
      issuingCountry,
      note
    });

    return res.status(201).json({
      message: 'Identity document created successfully',
      data: identityDocument
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating identity document',
      error: error.message
    });
  }
};

// Lấy thông tin IdentityDocuments theo ID
const getIdentityDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const identityDocument = await IdentityDocuments.findByPk(id);

    if (!identityDocument) {
      return res.status(404).json({
        message: 'Identity document not found'
      });
    }

    return res.status(200).json(identityDocument);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving identity document',
      error: error.message
    });
  }
};

// Lấy tất cả IdentityDocuments của một sinh viên
const getIdentityDocumentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const identityDocuments = await IdentityDocuments.findOne({
      where: { studentId }
    });

    if (!identityDocuments || identityDocuments.length === 0) {
      return res.status(404).json({
        message: 'No identity documents found for this student'
      });
    }

    return res.status(200).json(identityDocuments);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving identity documents',
      error: error.message
    });
  }
};

// Cập nhật IdentityDocuments
const updateIdentityDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      identityType,
      identityNumber,
      issueDate,
      issuePlace,
      expiryDate,
      chipAttached,
      issuingCountry,
      note
    } = req.body;

    const identityDocument = await IdentityDocuments.findByPk(id);

    if (!identityDocument) {
      return res.status(404).json({
        message: 'Identity document not found'
      });
    }

    await identityDocument.update({
      identityType,
      identityNumber,
      issueDate,
      issuePlace,
      expiryDate,
      chipAttached,
      issuingCountry,
      note
    });

    return res.status(200).json({
      message: 'Identity document updated successfully',
      data: identityDocument
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating identity document',
      error: error.message
    });
  }
};

// Xóa IdentityDocuments
const deleteIdentityDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const identityDocument = await IdentityDocuments.findByPk(id);

    if (!identityDocument) {
      return res.status(404).json({
        message: 'Identity document not found'
      });
    }

    await identityDocument.destroy();

    return res.status(200).json({
      message: 'Identity document deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting identity document',
      error: error.message
    });
  }
};

module.exports = {
  createIdentityDocument,
  getIdentityDocument,
  getIdentityDocumentsByStudent,
  updateIdentityDocument,
  deleteIdentityDocument
};