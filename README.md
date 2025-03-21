# Project Name
Student Management

## Hướng dẫn cài đặt và chạy chương trình
## Cài đặt
### Backend
```
cd backend/
```
```
npm install
```
- Tạo file <b>.env</b> với cấu trúc như <b>.env.example</b>
```
PORT=
NODE_ENV=

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DIALECT=
NODE_ENV=
```
- Yêu cầu có Database sử dụng <b>sequelize</b> để thiết lập, ở đây nhóm dùng <b>PostgreSQL</b>
### Frontend
```
cd frontend/
```
```
npm install
```
- Tạo file <b>.env.local</b> với cấu trúc như <b>.env.example</b>
```
NEXT_PUBLIC_API_URL=
```
- Mặc định frontend chạy PORT 3001, để tùy chỉnh vào file <b>package.json</b>
## Chạy chương trình
### Backend
```
npm run dev
```
### Frontend
```
npm run dev
```