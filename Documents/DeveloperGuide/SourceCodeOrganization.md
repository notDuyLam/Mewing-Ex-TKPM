# Tổ Chức Mã Nguồn

Tài liệu này mô tả cách tổ chức mã nguồn cho Hệ Thống Quản Lý Sinh Viên để đảm bảo tính rõ ràng, dễ bảo trì và mở rộng.

## Cấu Trúc Thư Mục

### Frontend (Next.js)
```
frontend/                                            # Giao diện người dùng
│   ├── src/                                         # Mã nguồn frontend
│   │   ├── app/                                     # Trang và định tuyến (Next.js)
│   │   │   ├── favicon.ico                          # Biểu tượng favicon
│   │   │   ├── i18n.js                              # Cấu hình đa ngôn ngữ
│   │   │   └── [locale]/                            # Định tuyến theo ngôn ngữ
│   │   │       ├── globals.css                      # CSS toàn cục
│   │   │       ├── HomeClient.tsx                   # Trang chủ (client-side)
│   │   │       ├── layout.tsx                       # Bố cục chung
│   │   │       ├── page.tsx                         # Trang mặc định
│   │   │       ├── classes/                         # Quản lý lớp học
│   │   │       │   ├── ClassClient.tsx              # Danh sách lớp (client-side)
│   │   │       │   ├── page.tsx                     # Trang danh sách lớp
│   │   │       │   └── [classId]/                   # Chi tiết lớp theo ID
│   │   │       │       ├── ClassDetailsClient.tsx   # Chi tiết lớp (client-side)
│   │   │       │       └── page.tsx                 # Trang chi tiết lớp
│   │   │       ├── courses/                         # Quản lý khóa học
│   │   │       │   ├── CourseClient.tsx             # Danh sách khóa (client-side)
│   │   │       │   └── page.tsx                     # Trang danh sách khóa
│   │   │       └── students/                        # Quản lý học sinh
│   │   │           └── [studentId]/                 # Chi tiết học sinh theo ID
│   │   │               ├── page.tsx                 # Trang chi tiết học sinh
│   │   │               └── StudentClient.tsx        # Chi tiết học sinh (client-side)
│   │   ├── components/                              # Component tái sử dụng
│   │   │   ├── AddStudentButton.tsx                 # Nút thêm học sinh
│   │   │   ├── ChangeLangButton.tsx                 # Nút đổi ngôn ngữ
│   │   │   ├── ExportButton.tsx                     # Nút xuất dữ liệu
│   │   │   ├── FilterSection.tsx                    # Bộ lọc dữ liệu
│   │   │   ├── ImportButton.tsx                     # Nút nhập dữ liệu
│   │   │   ├── ManageOptionsButton.tsx              # Nút quản lý tùy chọn
│   │   │   ├── StudentTable.tsx                     # Bảng danh sách học sinh
│   │   │   ├── TranslationProvider.js               # Ngữ cảnh dịch ngôn ngữ
│   │   │   └── ui/                                  # Component giao diện cơ bản
│   │   │       ├── table.tsx                        # Component bảng
│   │   │       └── ...                              # Component khác
│   │   ├── fonts/                                   # Font chữ
│   │   │   └── Roboto-Regular.js                    # Font Roboto Regular
│   │   ├── lib/                                     # Tiện ích chung
│   │   │   └── utils.ts                             # Hàm tiện ích TypeScript
│   │   ├── locales/                                 # Dịch ngôn ngữ
│   │   │   ├── en/                                  # Tiếng Anh
│   │   │   │   ├── student.json                     # Dịch trang học sinh
│   │   │   │   └── ...                              # Bản dịch khác
│   │   │   └── vi/                                  # Tiếng Việt
│   │   │       ├── student.json                     # Dịch trang học sinh
│   │   │       └── ...                              # Bản dịch khác
│   │   ├── i18nConfig.js                            # Cấu hình đa ngôn ngữ
│   │   └── middleware.js                            # Middleware yêu cầu
├── .env                                             # Biến môi trường
├── .env.example                                     # Mẫu biến môi trường
├── package.json                                     # Quản lý thư viện
├── next.config.js                                   # Cấu hình Next.js
└── ....                                             # Tệp cấu hình khác
```

### Backend (Node.js/Express.js)
```
backend/                                             # Backend chính
├── components/                                      # Xử lý API
│   ├── class/                                       # Quản lý lớp
│   │   ├── class.controller.js                      # API lớp học
│   │   └── class.routes.js                          # Route lớp học
│   ├── course/                                      # Quản lý khóa
│   │   ├── course.controller.js                     # API khóa học
│   │   └── course.routes.js                         # Route khóa học
│   ├── department/                                  # Quản lý khoa
│   │   ├── department.controller.js                 # API khoa
│   │   └── department.routes.js                     # Route khoa
│   ├── enrollment/                                  # Quản lý đăng ký
│   │   ├── enrollment.controller.js                 # API đăng ký
│   │   └── enrollment.routes.js                     # Route đăng ký
│   ├── program/                                     # Quản lý chương trình
│   │   ├── program.controller.js                    # API chương trình
│   │   └── program.routes.js                        # Route chương trình
│   ├── semester/                                    # Quản lý học kỳ
│   │   ├── semester.controller.js                   # API học kỳ
│   │   └── semester.routes.js                       # Route học kỳ
│   ├── staff/                                       # Quản lý nhân viên
│   │   ├── staff.controller.js                      # API nhân viên
│   │   └── staff.routes.js                          # Route nhân viên
│   ├── status/                                      # Quản lý trạng thái
│   │   ├── status.controller.js                     # API trạng thái
│   │   └── status.routes.js                         # Route trạng thái
│   ├── student/                                     # Quản lý học sinh
│   │   ├── identityDocuments/                       # Quản lý giấy tờ
│   │   │   ├── identityDocuments.controller.js      # API giấy tờ
│   │   │   └── identityDocuments.routes.js          # Route giấy tờ
│   │   ├── studentDetails/                          # Quản lý chi tiết
│   │   │   ├── studentDetails.controller.js         # API chi tiết
│   │   │   └── studentDetails.routes.js             # Route chi tiết
│   │   ├── student.controller.js                    # API học sinh
│   │   └── student.routes.js                        # Route học sinh
│   └── teacher/                                     # Quản lý giáo viên
│       ├── teacher.controller.js                    # API giáo viên
│       └── teacher.routes.js                        # Route giáo viên
├── config/                                          # Cấu hình hệ thống
│   ├── config.js                                    # Cấu hình DB, môi trường
│   └── multerConfig.js                              # Cấu hình upload
├── log/                                             # Công cụ log
│   └── logger.js                                    # Ghi log
├── logs/                                            # Tệp log
│   ├── combined.log                                 # Log tổng hợp
│   └── error.log                                    # Log lỗi
├── migrations/                                      # Quản lý lược đồ
│   ├── 20250415152128-create-enrollments.js         # Tạo bảng đăng ký
│   └── ...                                          # Migration khác
├── models/                                          # Mô hình dữ liệu
│   ├── classes.js                                   # Mô hình lớp học
│   ├── course.js                                    # Mô hình khóa học
│   ├── department.js                                # Mô hình khoa
│   ├── enrollment.js                                # Mô hình đăng ký
│   ├── identityDocument.js                          # Mô hình giấy tờ
│   ├── index.js                                     # Kết nối mô hình
│   ├── program.js                                   # Mô hình chương trình
│   ├── registrationHistories.js                     # Mô hình lịch sử
│   ├── semester.js                                  # Mô hình học kỳ
│   ├── staff.js                                     # Mô hình nhân viên
│   ├── status.js                                    # Mô hình trạng thái
│   ├── student.js                                   # Mô hình học sinh
│   ├── studentDetail.js                             # Mô hình chi tiết
│   └── teachers.js                                  # Mô hình giáo viên
├── seeders/                                         # Dữ liệu mẫu
│   ├── 20250414173210-seed-enrollments.js           # Dữ liệu đăng ký
│   └── ...                                          # Dữ liệu khác
├── tests/                                           # Kiểm thử
│   ├── controllers/                                 # Kiểm thử API
│   │   ├── class.test.js                            # Test API lớp
│   │   ├── course.test.js                           # Test API khóa
│   │   ├── enrollment.test.js                       # Test API đăng ký
│   │   ├── staff.test.js                            # Test API nhân viên
│   │   └── student.test.js                          # Test API học sinh
│   └── models/                                      # Kiểm thử mô hình
│       ├── course.test.js                           # Test mô hình khóa
│       └── student.test.js                          # Test mô hình học sinh
├── .env                                             # Biến môi trường
├── .env.example                                     # Mẫu môi trường
├── .gitignore                                       # Tệp bỏ qua Git
├── app.js                                           # Khởi chạy ứng dụng
├── package-lock.json                                # Phụ thuộc phiên bản
├── package.json                                     # Quản lý thư viện
└── ....                                             # Tệp cấu hình khác
```

### Cơ Sở Dữ Liệu
- **Migrations**: Lưu trong `backend/migrations/` để quản lý thay đổi schema.
- **Seeds**: Lưu trong `backend/seeders/` để khởi tạo dữ liệu mẫu.

## Quy Tắc Đặt Tên
- **Frontend**:
  - File component: PascalCase (e.g., `StudentCard.tsx`).
  - File page: kebab-case (e.g., `student-list.tsx`).
- **Backend**:
  - File controller/service: camelCase (e.g., `studentController.ts`).
  - File model: PascalCase (e.g., `Student.ts`).
- **Cơ sở dữ liệu**: snake_case (e.g., `students`, `course_id`).
