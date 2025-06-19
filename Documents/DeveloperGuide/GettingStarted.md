# Project Name

Student Management

## Hướng dẫn cài đặt và chạy chương trình

## Cài đặt

### Backend

1. ```
    cd backend/
   ```
2. ```
    npm install
   ```
3. Tạo file <b>.env</b> với cấu trúc như <b>.env.example</b>

   ```
    PORT=
    NODE_ENV=

    DB_NAME=
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_DIALECT=
    ALLOWED_EMAIL_DOMAIN=student.hcmus.edu.vn
    ALLOWED_PHONE_NUMBERS=[{"code":"VN","name":"Vietnam","regex":"^\\+84\\d{9,10}$"},{"code":"US","name":"United States","regex":"^\\+1\\d{10}$"},{"code":"UK","name":"United Kingdom","regex":"^\\+44\\d{10}$"}]
   ```

- **PORT**: Cổng chạy ứng dụng Node.js
- **NODE_ENV**: `development`, `production`, hoặc `test`
- **DB_NAME**: Tên database
- **DB_USER**: Tên user database
- **DB_PASSWORD**: Mật khẩu database
- **DB_HOST**: Địa chỉ database (nếu cục bộ thì là `localhost`)
- **DB_PORT**: Cổng database (PostgreSQL thường là `5432`, MySQL là `3306`)
- **DB_DIALECT**: Loại database (`postgres`, `mysql`, `sqlite`, v.v.)
- **ALLOWED_EMAIL_DOMAIN=student.hcmus.edu.vn**: Email sinh viên chỉ được phép có tên miền này

4. Yêu cầu có Database sử dụng <b>sequelize</b> để thiết lập, ở đây nhóm dùng <b>PostgreSQL</b>. Sau đó tiến hành chạy migrate để tạo bảng
   ```
   npx sequelize-cli db:migrate
   ```
5. Tiếp đến, tiến hành điền dữ liệu seeders

   ```
   npx sequelize-cli db:seed:all
   ```

6. Test
   Để tiến hành kiểm thử và chạy các test case, sử dụng:
   ```
   npm test
   ```

### Frontend

1.  ```
    cd frontend/
    ```
2.  ```
    npm install
    ```
3.  Tạo file <b>.env.local</b> với cấu trúc như <b>.env.example</b>
    ```
    NEXT_PUBLIC_API_URL=
    NEXT_PUBLIC_ALLOWED_PHONE_NUMBERS=[{"code":"VN","name":"Vietnam","regex":"^\\+84\\d{9,10}$"},{"code":"US","name":"United States","regex":"^\\+1\\d{10}$"},{"code":"UK","name":"United Kingdom","regex":"^\\+44\\d{10}$"}]
    ```

- Mặc định frontend chạy <b>PORT 3001</b>, để tùy chỉnh vào file <b>package.json</b>

## Chạy chương trình

### Backend

```
npm run dev
```

### Frontend

```
npm run dev
```

## Cấu Hình Đa Ngôn Ngữ
- File dịch thuật nằm trong `frontend/src/locales/`.
- Thêm ngôn ngữ mới bằng cách tạo thư mục (e.g., `en/`) và file JSON tương ứng.
- Cập nhật `i18nConfig.js` trong `frontend/src/` để thêm ngôn ngữ mới.

## Lưu Ý
- Kiểm tra tính hợp lệ của email (`@student.university.edu.vn`) và số điện thoại (`+84xxxxxxxxx`).
- Đảm bảo tất cả thay đổi schema được thực hiện qua migrations.