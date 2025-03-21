'use strict';

const multer = require('multer');

const storage = multer.memoryStorage(); // Lưu file vào bộ nhớ tạm thời
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only CSV and Excel files are allowed'));
    }
    cb(null, true);
  }
});

module.exports = upload;