# 🧠 MIND CARE - Nền Tảng Chăm Sóc Sức Khỏe Tinh Thần Học Đường

MIND CARE là ứng dụng web hỗ trợ đánh giá, theo dõi và tham vấn sức khỏe tâm lý cho học sinh dựa trên bộ câu hỏi chuẩn **DASS-21**, kết hợp Trợ lý AI đồng hành và kết nối lịch hẹn với Chuyên gia tâm lý.

---

## 📋 Yêu Cầu Hệ Thống (Requirements)

Trước khi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt:
1. **Node.js**: Phiên bản `v18.0` trở lên ([Tải tại nodejs.org](https://nodejs.org/))
2. **Microsoft SQL Server**: Bản Express hoặc Standard (Mặc định chạy tại port `14330` hoặc `1433`).

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng (Cách Đơn Giản Nhất)

### 🌟 Cách 1: Chạy 1-Click (Dành cho mọi người dùng)

Không cần gõ lệnh thủ công! Dự án đã tích hợp sẵn script tự động hóa kiểm tra môi trường, cài đặt thư viện và khởi tạo Database:

1. **Nhấp đúp chuột vào tệp `run-dev.cmd`** trong thư mục dự án.
   * *Script sẽ tự động:*
     * Tạo tệp cấu hình `.env.local` từ `.env.example` (nếu chưa có).
     * Cài đặt các gói phụ thuộc `npm install` (nếu chưa cài).
     * Áp dụng cấu trúc CSDL `npm run db:migrate`.
     * Khởi chạy Web Server tại `http://localhost:3000`.
2. Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

*(Nếu muốn chạy bản Production tốc độ cao đã đóng gói sẵn, nhấp đúp vào `run-web.cmd`).*

---

### 💻 Cách 2: Chạy Bằng Dòng Lệnh (Dành cho Lập trình viên)

Nếu bạn sử dụng Terminal / Command Prompt / PowerShell:

#### Bước 1: Cài đặt thư viện phụ thuộc
```bash
npm install
```

#### Bước 2: Cấu hình môi trường
Sao chép tệp mẫu `.env.example` thành `.env.local`:
* **Windows (CMD):** `copy .env.example .env.local`
* **Linux / MacOS / Bash:** `cp .env.example .env.local`

*(Kiểm tra các thông số kết nối Database `DB_SERVER`, `DB_USER`, `DB_PASSWORD` trong `.env.local` nếu cần).*

#### Bước 3: Khởi tạo CSDL & Khởi chạy Web (1 lệnh duy nhất)
```bash
npm run setup:dev
```
Hoặc chạy từng lệnh riêng lẻ:
```bash
npm run db:migrate
npm run dev
```
Trình duyệt sẽ sẵn sàng tại: **`http://localhost:3000`**

---

## 🛠️ Các Câu Lệnh Npm Cần Thiết (Npm Scripts)

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy môi trường phát triển (Development mode với Hot-reload) |
| `npm run setup` | Cài đặt `node_modules` và tự động cập nhật Migration Database |
| `npm run setup:dev` | Cài đặt toàn bộ phụ thuộc, tạo DB và khởi chạy web lập tức |
| `npm run db:migrate` | Đọc file SQL migration và cập nhật các bảng vào SQL Server |
| `npm run build` | Đóng gói ứng dụng cho môi trường Production |
| `npm run start` | Chạy ứng dụng bản Production sau khi build |

---

## 🗄️ Cấu Hình CSDL (Database Setup)

* **Hệ quản trị CSDL:** Microsoft SQL Server (Database name: `MINDCARE`).
* **Cấu hình kết nối mẫu trong `.env.local`:**
  ```env
  DB_SERVER=127.0.0.1
  DB_PORT=14330
  DB_NAME=MINDCARE
  DB_USER=mindcare_app
  DB_PASSWORD=mindcare_password
  AUTH_SECRET=mindcare_secret_auth_key_2026_safe_32chars
  ```
* **Bản vẽ bảng SQL:** `database/migrations/0001_mindcare.sql` (Bao gồm 11 bảng: `users`, `profiles`, `experts`, `surveys`, `survey_attempts`, `assessment_results`, `appointments`, `sos_requests`, v.v.).

---

## 🧱 Cấu Trúc Dự Án (Project Architecture)

* **`/app`**: Next.js App Router (Giao diện trang & Backend REST API endpoints).
* **`/components`**: Các thành phần UI nguyên bản (Shadcn UI) & UI theo từng chức năng.
* **`/lib`**: Kết nối SQL Server (`db.ts`), xử lý phân loại DASS-21 (`mind-care.ts`), mã hóa Session (`session.ts`).
* **`/database` & `/scripts`**: Lưu bản vẽ cấu trúc CSDL SQL và script tự động migration.

