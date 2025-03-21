'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json } = format;

// Định dạng log tùy chỉnh
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
});

const logger = createLogger({
  level: 'info', // Mức log mặc định
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Thêm timestamp
    json(), // Lưu metadata dưới dạng JSON
    logFormat // Định dạng tùy chỉnh
  ),
  transports: [
    // Ghi log ra console (dùng trong dev)
    new transports.Console(),
    // Ghi log ra file (dùng trong production)
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Chỉ ghi lỗi
    new transports.File({ filename: 'logs/combined.log' }) // Ghi tất cả log
  ]
});

// Nếu không chạy trong production, bật log chi tiết vào console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      timestamp(),
      logFormat
    )
  }));
}

module.exports = logger;