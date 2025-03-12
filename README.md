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
1. Cài đặt postgreSQL nếu chưa có
2. Tạo 1 database với username và mật khẩu
3. Tạo file .env với cấu trúc:
```
DB_USER="username"
DB_PASSWORD="password"
```
5. Cài đặt các thư viện cần thiết bằng lệnh
```sh
npm install
```
7. Cài đặt Extension **Live Server** trên Visual Studio Code (hoặc các Extension có chức năng tương tự) 
### Chạy chương trình
- **Backend**: Chạy bằng lệnh:
```sh
npm run dev
```
- **Frontend**: Mở file `index.html` bằng **Live Server** trong VS Code.
 
