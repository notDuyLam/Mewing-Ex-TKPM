# Cập Nhật Một Thực Thể Hiện Có (Thêm Thuộc Tính Mới)

Tài liệu này hướng dẫn cách thêm một thuộc tính mới vào một thực thể hiện có trong Hệ Thống Quản Lý Sinh Viên, sử dụng Next.js, Express.js, và PostgreSQL với Sequelize.

## Ví Dụ: Thêm Thuộc Tính `emergency_contact` vào Thực Thể `Student`

### 1. Cập Nhật Schema Cơ Sở Dữ Liệu
- **Tạo Migration**:
  Tạo file migration để thêm cột `emergency_contact` vào bảng `students`.
  ```bash
  npx sequelize-cli migration:generate --name add-emergency-contact-to-students
  ```
  Nội dung file migration (ví dụ: `backend/migrations/20250617-add-emergency-contact.js`):
  ```javascript
  'use strict';

  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('students', 'emergency_contact', {
        type: Sequelize.STRING(15),
        allowNull: true,
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('students', 'emergency_contact');
    },
  };
  ```
- **Chạy Migration**:
  ```bash
  npx sequelize-cli db:migrate
  ```

### 2. Cập Nhật Model Sequelize
Cập nhật file `backend/models/student.js`:
```javascript
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
class Student extends Model {
    static associate(models) {
      // define association here
      Student.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "department",
      });
      Student.belongsTo(models.Status, {
        foreignKey: "statusId",
        as: "status",
      });
      Student.belongsTo(models.Program, {
        foreignKey: "programId",
        as: "program",
      });
      Student.hasOne(models.StudentDetails, {
        foreignKey: "studentId",
        as: "details",
      });
      Student.hasMany(models.IdentityDocuments, {
        foreignKey: "studentId",
        as: "identityDocuments",
      });
    }
  }
  Student.init(
    {
      studentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      // ... các thuộc tính khác ...
      emergency_contact: {
      type: DataTypes.STRING(15),
      allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
```

### 3. Cập Nhật Controller và Routes
- **Controller (`backend/components/student/student.controller.js`)**:
  Cập nhật các hàm để xử lý thuộc tính mới:
- **Routes (`backend/components/student/student.routes.js`)**:
  Thêm route để xử lý thuộc tính mới (nếu cần)

### 4. Cập Nhật Frontend
- **Component (`frontend/src/components/addStudentButton.tsx`)**:
  Thêm trường nhập liệu.
- **Component (`frontend/src/components/StudentTable.tsx`)**:
  Thêm trường hiển thị.
- **Component (`frontend/src/app/[locale]/students/[studentId]/StudentClient.tsx`)**:
  Thêm trường hiển thị.
### 6. Cập Nhật Dịch Thuật
Thêm key dịch thuật trong dịch thuật trong bản dịch tiếng việt:
- `frontend/src/locales/vi/add_student.json`
- `frontend/src/locales/vi/student_table.json`
- `frontend/src/locales/vi/student.json`
```json
{
  "emergency_contact": "Số liên lạc khẩn cấp"
}
```
Thêm key dịch thuật trong dịch thuật trong bản dịch khác.

### 7. Kiểm Thử
- Kiểm tra thủ công việc thêm/sửa `emergency_contact` qua giao diện.
- Thêm test case trong tài liệu unit test (xem phần Unit Testing).
- Cập nhật logging để ghi lại hành động cập nhật thuộc tính mới.

### 8. Commit và Push
```bash
git add .
git commit -m "[FEBE]: Thêm thuộc tính emergency_contact cho sinh viên"
git push origin feature/add-emergency-contact
```

## Lưu Ý
- Đảm bảo chạy migration trước khi deploy.
- Kiểm tra ràng buộc nghiệp vụ.