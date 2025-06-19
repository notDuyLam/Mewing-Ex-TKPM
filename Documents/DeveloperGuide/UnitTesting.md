# Unit Testing

Tài liệu này mô tả cách tiếp cận unit testing cho Hệ Thống Quản Lý Sinh Viên, tập trung vào các best practices và kế hoạch kiểm thử.

## Tổng Quan Unit Testing
Unit testing là quá trình kiểm tra các đơn vị mã nguồn nhỏ nhất (hàm, phương thức) để đảm bảo chúng hoạt động đúng như kỳ vọng. Dự án sử dụng **Jest**.

## Best Practices
- **Kiểm thử độc lập**: Unit test không được phụ thuộc vào cơ sở dữ liệu, API bên ngoài, hoặc trạng thái toàn cục. Sử dụng mock (thư viện `jest.mock`) để giả lập dependencies.
- **Kiểm thử cả happy case và edge case**:
  - Happy case: Dữ liệu hợp lệ (ví dụ: thêm sinh viên với MSSV hợp lệ).
  - Edge case: Dữ liệu không hợp lệ (ví dụ: email sai định dạng, MSSV trùng lặp).
- **Tính dễ bảo trì**: Viết test rõ ràng, sử dụng tên mô tả (ví dụ: `should create a class successfully`).
- **Không phụ thuộc chi tiết triển khai**: Test dựa trên kết quả đầu ra, không dựa vào cách hàm được viết.

## Ví Dụ Kiểm Thử

### Kiểm Thử Service
File: `backend/__tests__/studentService.test.ts`
```javascript
const {createClass, getClassById, getAllClasses, getStudents, updateClass} = require('../../components/class/class.controller');

jest.mock('../../models');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // .status().json()
    res.json = jest.fn();
    return res;
};

const Course = require("../../models").Course;
const Class = require("../../models").Class;
const Enrollment = require("../../models").Enrollment;

describe("createClass", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a class successfully", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            body: classObject
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            status: "activate",
        }
        Course.findByPk.mockResolvedValue(courseObject);
        Class.findOne.mockResolvedValue(null); // Không tồn tại
        Class.create.mockResolvedValue(classObject);

        // Gọi controller
        await createClass(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(classObject);
    })

    it("should return 400 if course status is deactivate", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            body: classObject
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            status: "deactivate",
        }
        Course.findByPk.mockResolvedValue(courseObject);

        // Gọi controller
        await createClass(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Course is deactive" });
    })

    it("should return 400 if class already exists", async () => {
        const classObject = {
            classId: "C123",
            courseId: "CSE101",
            year: 2025,
            semesterId: 1,
            teacherId: "T123",
            maxStudent: 30,
            schedule: "10:00:00",
            room: "Room A101",
        }
        const req = {
            body: classObject
        };

        const res = mockResponse();

        // Mocks
        const courseObject = {
            status: "activate",
        }
        Course.findByPk.mockResolvedValue(courseObject);
        Class.findOne.mockResolvedValue(classObject);

        // Gọi controller
        await createClass(req, res);

        // Kiem tra ket qua
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Class already exists" });
    })
})
```

## Kế Hoạch Kiểm Thử
### Model
- **Khóa học**:
    - Tạo khóa học với dữ liệu hợp lệ.
    - Tạo khóa học với dữ liệu lỗi.
- **Sinh viên**:
    - Tạo khóa học với dữ liệu hợp lệ.
    - Tạo khóa học với dữ liệu lỗi.
### Controller
- **Khóa học**:
    - Tạo khóa học có môn tiên quyết với dữ liệu hợp lệ.
    - Tạo khóa học có môn tiên quyết với dữ liệu lỗi.
    - Tạo khóa học không có môn tiên quyết với dữ liệu hợp lệ.
    - Tạo khóa học với dữ liệu lỗi.
    - Xóa khóa học (hoặc chuyển trạng thái thành deactive).
    - Tìm kiếm khóa học.
- **Lớp học**:
    - Tạo lớp học với dữ liệu hợp lệ.
    - Tạo lớp học thất bại nếu khóa học có trạng thái là deactive.
    - Tạo lớp học thất bại nếu trùng mã lớp.
    - Tìm kiếm lóp học.
    - Lấy sinh viên của một lớp học.
    - Cập nhật dữ liệu lớp học
- **Đăng ký sinh viên vào lớp**:
    - Đăng ký với dữ liệu hợp lệ.
    - Đăng ký với dữ liệu lỗi.
    - Đăng ký thất bại nếu lớp đầy.
    - Đăng ký thất bại nếu đã tồn tại dữ liệu.
    - Đăng ký thất bại nếu sinh viên chưa hoàn thành môn tiên quyết
- **Nhân viên**:
    - Tìm kiếm nhân viên
- **Sinh viên**:
    - Tạo nhân viên với dữ liệu hợp lệ

## Thiết Lập Kiểm Thử
1. Cài đặt dependencies:
   ```bash
   npm install --save-dev jest
   ```
2. Cấu hình Jest trong `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest",
        "details-test": "jest --verbose"
     }
   }
   ```
3. Chạy kiểm thử:
    - Tổng quát
        ```bash
        npm run test
        ```
    - Chi tiết:
        ```bash
        npm run details-test
        ```
## Lưu Ý
- Thêm mock cho Sequelize để tránh kết nối cơ sở dữ liệu thật.