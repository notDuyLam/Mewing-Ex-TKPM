# Tổng Quan Kiến Trúc

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc của Hệ Thống Quản Lý Sinh Viên, được xây dựng bằng Next.js (frontend), Node.js/Express.js (backend) và PostgreSQL (cơ sở dữ liệu).

## Kiến Trúc Tổng Quan
Hệ thống tuân theo **kiến trúc client-server** với sự phân tách rõ ràng các thành phần:
- **Frontend (Next.js)**: Xử lý giao diện người dùng, tương tác người dùng và gọi API.
- **Backend (Node.js/Express.js)**: Quản lý logic nghiệp vụ, xác thực dữ liệu và tương tác với cơ sở dữ liệu.
- **Cơ sở dữ liệu (PostgreSQL)**: Lưu trữ tất cả dữ liệu bền vững với Sequelize làm ORM.

## Frontend (Next.js)
- **Framework**: Next.js với TypeScript, hỗ trợ render tĩnh và  server side.
- **Cấu trúc giao diện**:
  - Sử dụng **React Functional Components** với hooks.
  - Áp dụng **Tailwind CSS** để tạo giao diện responsive và dễ bảo trì.
  - Tích hợp `react-i18next` để hỗ trợ đa ngôn ngữ
  - Sử dụng `axios` hoặc `fetch` để kết nối với server

## Backend (Node.js/Express.js)
- **Framework**: Express.js với JavaScript để xây dựng RESTful API.
- **Cấu trúc**:
  - **Components**: Chứa các xử lý của từng phần (student, class), bao gồm:
    - **Controllers**: Xử lý các request HTTP và trả về kết quả. Chứa logic nghiệp vụ (ví dụ: kiểm tra môn tiên quyết).
    - **Routes**: Định tuyến các yêu cầu từ phía người dùng.
  - **Models**: Định nghĩa schema và tương tác với cơ sở dữ liệu qua Sequelize.
- **API Conventions**:
  - Sử dụng danh từ số nhiều cho tài nguyên (ví dụ: `/students`, `/courses`).
  - HTTP methods: `GET` (lấy dữ liệu), `POST` (tạo), `PUT` (cập nhật), `DELETE` (xóa).

## Cơ Sở Dữ Liệu (PostgreSQL)
- **ORM**: Sequelize để quản lý schema và truy vấn.
- **Cấu trúc dữ liệu**:
  - Bảng `students`: Lưu thông tin sinh viên (MSSV, họ tên, khóa học, v.v.).
  - Bảng `studentDetails`: Lưu thông tin cá nhân của sinh viên (email, địa chỉ, v.v.)
  - Bảng `courses`: Lưu thông tin khóa học (mã khóa học, tên, số tín chỉ, v.v.).
  - Bảng `classes`: Lưu thông tin lớp học (mã lớp học, tên, thời gian, v.v.)
  - Bảng `enrollment`: Quản lý đăng ký lớp học của một khóa học của sinh viên.
  - Bảng `registrationHistories`: Lưu trữ lịch sử đăng kí của sinh viên
  - Các bảng khác: `departments`, `program`, `semesters`, `staffs`, `teachers`, `status`.

## Luồng Dữ Liệu
1. Người dùng tương tác qua giao diện Next.js.
2. Next.js gửi yêu cầu đến API Express.js.
3. Express.js xử lý logic, tương tác với PostgreSQL qua Sequelize.
4. Dữ liệu được trả về và hiển thị trên giao diện.

## Công Cụ Hỗ Trợ
- **Logging**: `winston` (backend)
- **Version Control**: Git với commit message theo cấu trúc `[where]: {description}`.