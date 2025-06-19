# Sơ Đồ Cơ Sở Dữ Liệu

Tài liệu này mô tả sơ đồ cơ sở dữ liệu (schema) cho Hệ Thống Quản Lý Sinh Viên, sử dụng PostgreSQL và Sequelize.

## Các Bảng Chính

### 1. Students
Lưu thông tin sinh viên.
| Cột                  | Kiểu Dữ Liệu | Ràng Buộc                | Mô Tả                    |
|----------------------|--------------|--------------------------|--------------------------|
| studentId            | STRING       | PRIMARY KEY              | Khóa chính               |
| fullName             | STRING       | NOT NULL                 | Họ tên                   |
| dateOfBirth          | DATE         | NOT NULL                 | Ngày sinh                |
| gender               | STRING       | NOT NULL                 | Giới tính                |
| course               | STRING       | NOT NULL                 | Khóa (e.g., K22)         |
| email                | STRING       | UNIQUE, NOT NULL         | Email                    |
| phoneNumber          | STRING       | NOT NULL                 | Số điện thoại            |
| departmentId         | INTEGER      | FOREIGN KEY, NOT NULL    | Khoa (e.g., CNTT)        |
| statusId             | INTEGER      | FOREIGN KEY, NOT NULL    | Tình trạng học           |
| programId            | INTEGER      | FOREIGN KEY, NOT NULL    | Chương trình học         |

### 2. StudentDetails
Lưu thông tin sinh viên.
| Cột                      | Kiểu Dữ Liệu | Ràng Buộc                | Mô Tả                    |
|--------------------------|--------------|--------------------------|--------------------------|
| studentId                | STRING       | PRIMARY KEY              | Mã sinh viên             |
| permanentAddressHouse    | STRING       | NOT NULL                 | Số nhà                   |
| permanentAddressWard     | STRING       | NOT NULL                 | Tên đường                |
| permanentAddressDistrict | STRING       | NOT NULL                 | Tên quận/huyện           |
| permanentAddressCity     | STRING       | NOT NULL                 | Tỉnh/Thành phố           |
| permanentAddressCountry  | STRING       | NOT NULL                 | Quốc gia                 |
| temporaryAddress         | STRING       | NOT NULL                 | Nơi tạm trú              |
| mailingAdress            | STRING       | NOT NULL                 | Địa chỉ mail             |
| nationality              | STRING       | NOT NULL                 | Quốc tịch                |

### 3. IdentityDocuments
Lưu thông tin sinh viên.
| Cột                      | Kiểu Dữ Liệu | Ràng Buộc     | Mô Tả                    |
|--------------------------|--------------|---------------|--------------------------|
| studentId                | STRING       | PRIMARY KEY   | Mã sinh viên             |
| identityType             | STRING       | NOT NULL      | Loại (CCCD, CMNN)        |
| identityNumber           | STRING       | NOT NULL      | Số CCCD/CMND             |
| issueDate                | DATE         | NOT NULL      | Ngày cấp                 |
| issuePlace               | STRING       | NOT NULL      | Nơi cấp                  |
| expiryDate               | DATE         | NOT NULL      | Ngày hết hạn             |
| chipAttched              | BOOLEAN      | NOT NULL      | Có gắn chíp?             |
| issuingCountry           | STRING       | NOT NULL      | Quốc gia                 |
| note                     | STRING       | NOT NULL      | Ghi chú                  |

### 4. Departments
Lưu thông tin khoa.
| Cột         | Kiểu Dữ Liệu | Ràng Buộc           | Mô Tả            |
|-------------|--------------|---------------------|------------------|
| id          | INTEGER      | PRIMARY KEY         | Khóa chính       |
| name        | STRING       | NOT NULL            | Tên khoa         |

### 5. Status
Lưu thông tin khoa.
| Cột         | Kiểu Dữ Liệu | Ràng Buộc           | Mô Tả            |
|-------------|--------------|---------------------|------------------|
| id          | INTEGER      | PRIMARY KEY         | Khóa chính       |
| name        | STRING       | NOT NULL            | Tên tình trạng   |

### 6. Programs
Lưu thông tin khoa.
| Cột         | Kiểu Dữ Liệu | Ràng Buộc           | Mô Tả            |
|-------------|--------------|---------------------|------------------|
| id          | INTEGER      | PRIMARY KEY         | Khóa chính       |
| name        | STRING       | NOT NULL            | Tên chương trình |

### 7. Teachers
Lưu thông tin khoa.
| Cột         | Kiểu Dữ Liệu | Ràng Buộc           | Mô Tả            |
|-------------|--------------|---------------------|------------------|
| id          | INTEGER      | PRIMARY KEY         | Khóa chính       |
| name        | STRING       | NOT NULL            | Tên chương trình |

### 8. Teachers
Lưu thông tin khoa.
| Cột         | Kiểu Dữ Liệu | Ràng Buộc           | Mô Tả            |
|-------------|--------------|---------------------|------------------|
| id          | INTEGER      | PRIMARY KEY         | Khóa chính       |
| name        | STRING       | NOT NULL            | Tên chương trình |

### 9. Courses
Lưu thông tin khóa học.
| Cột             | Kiểu Dữ Liệu | Ràng Buộc             | Mô Tả                    |
|-----------------|--------------|-----------------------|--------------------------|
| courseId        | STRING       | PRIMARY KEY           | Mã khóa học              |
| courseName      | STRING       | NOT NULL              | Tên khóa học             |
| credits         | INTEGER      | NOT NULL, >=2         | Số tín chỉ               |
| faculty_id      | UUID         | FOREIGN KEY, NOT NULL | Khoa phụ trách           |
| description     | STRING       |                       | Mô tả                    |
| preCourseId     | STRING       | FOREIGN KEY           | Môn tiên quyết (nếu có)  |
| status          | ENUM         | DEFAULT activate      | Trạng thái hoạt động     |
| timestamp       | TIME         | NOT NULL              | Thời gian tạo            |

### 10. Classes
Lưu thông tin lớp học.
| Cột             | Kiểu Dữ Liệu | Ràng Buộc             | Mô Tả                    |
|-----------------|--------------|-----------------------|--------------------------|
| classId         | STRING       | PRIMARY KEY           | Mã lớp học               |
| courseId        | STRING       | FOREIGN KEY, NOT NULL | Khóa học                 |
| semesterId      | INTEGER      | FOREIGN KEY, NOT NULL | Học kỳ                   |
| year            | INTEGER      | NOT NULL              | Năm học                  |
| teacherId       | INTEGER      | FOREIGN KEY, NOT NULL | Giảng viên               |
| maxStudent      | INTEGER      | NOT NULL              | Số lượng tối đa          |
| schedule        | TIME         | NOT NULL              | Lịch học                 |
| room            | STRING       | NOT NULL              | Phòng học                |

### 11. Enrollments
Lưu thông tin đăng ký khóa học.
| Cột             | Kiểu Dữ Liệu | Ràng Buộc             | Mô Tả                    |
|-----------------|--------------|-----------------------|--------------------------|
| id              | INTEGER      | PRIMARY KEY           | Khóa chính               |
| studentId       | STRING       | FOREIGN KEY, NOT NULL | Sinh viên                |
| classId         | STRING       | FOREIGN KEY, NOT NULL | Lớp học                  |
| registerBy      | INTEGER      | FOREIGN KEY, NOT NULL | Người đăng ký            |
| registrationAt  | DATE         | NOT NULL              | Thời gian đăng ký        |
| grade           | FLOAT        |                       | Điểm số                  |
| status          | STRING       |                       | Trạng thái               |


### 12. registrationHistories
Lưu lịch sử hủy đăng ký.
| Cột             | Kiểu Dữ Liệu | Ràng Buộc             | Mô Tả                        |
|-----------------|--------------|-----------------------|------------------------------|
| id              | INTEGER      | PRIMARY KEY           | Khóa chính                   |
| studentId       | STRING       | FOREIGN KEY, NOT NULL | Sinh viên                    |
| classId         | STRING       | FOREIGN KEY, NOT NULL | Lớp học                      |
| action          | TRING        | NOT NULL              | Hành động (REGISTER, CANCEL) |
| performAt       | TIMESTAMP    | NOT NULL              | Thời gian thực hiện          |
| performBy       | INTEGER      | NOT NULL              | Người thực hiện              |

### 13. Semester
Lưu lịch sử hủy đăng ký.
| Cột             | Kiểu Dữ Liệu | Ràng Buộc             | Mô Tả                            |
|-----------------|--------------|-----------------------|----------------------------------|
| id              | INTEGER      | PRIMARY KEY           | Khóa chính                       |
| year            | INTEGER      | NOT NULL              | Năm                              |
| startDate       | DATE         | NOT NULL              | Ngày bắt đầu                     |
| endDate         | DATE         | NOT NULL              | Ngày kết thúc                    |
| cancelDeadline  | DATE         | NOT NULL              | Ngày cuối cùng hủy đăng ký (lớp) |

## Ràng Buộc Nghiệp Vụ
- MSSV và email phải duy nhất.
- Email phải có đuôi `@student.university.edu.vn`.
- Số điện thoại phải theo định dạng Việt Nam (`+84xxxxxxxxx` hoặc `0[3|5|7|8|9]xxxxxxxx`).
- Tình trạng sinh viên chỉ chuyển đổi theo quy tắc (ví dụ: từ `Đang học` sang `Bảo lưu`, không thể từ `Đã tốt nghiệp` về `Đang học`).
- Số tín chỉ khóa học >= 2.
- Không thể xóa khóa học nếu có lớp học hoặc sinh viên đăng ký.
