const fs = require("fs");
const path = require("path");

const oldPath = path.join(__dirname, "locales/en");
const newPath = path.join(__dirname, "src/locales/en");

if (fs.existsSync(newPath)) {
  fs.rmSync(newPath, { recursive: true, force: true }); // Xóa nếu có
}

fs.cpSync(oldPath, newPath, { recursive: true }); // Copy thay vì rename

// Sau khi copy xong thì xóa thư mục cũ
fs.rmSync(oldPath, { recursive: true, force: true });
