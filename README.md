# Project Name
Student Management

## Cấu trúc source code
```
student-management/
│── backend/
│   └── config/
│       └── database.js
│   └── controllers/
│       └── studentController.js
│   └── models/
│       └── student.js
│   └── routes/
│       └── studentRoutes.js
│   └── app.js
│── frontend/
│   └── index.html
│   └── script.js
│   └── style.css                           
│── package.json
│── package-lock.json
│── .gitignore       
│── README.md
```

## Hướng dẫn cài đặt và chạy chương trình
### Cài đặt
1. Cài đặt postgreSQL nếu chưa có hoặc sử dụng database đã có.
2. Nếu dùng pgAdmin cho việc cài postgreSQL local. Tạo 1 database với username và mật khẩu
3. Tạo file .env với cấu trúc:
```
DB_URL="localhost"
DB_USER="username"
DB_PASSWORD="password"
```
4. Điền các thông tin vào .env, DB_URL nếu dùng local thì giữ nguyên.
5. Cài đặt các thư viện cần thiết bằng lệnh
```sh
npm install
```
### Chạy chương trình
1. **Backend**: Khởi chạy server lắng nghe port 3000
```sh
npm run dev
```
2. **Frontend**: Mở file `index.html` bằng 1 công cụ trình duyệt (Chrome).


 
