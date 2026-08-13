# Mind Care

## Chạy dự án trên Windows

Nhấp đúp vào `run-dev.cmd` trong thư mục dự án. Tệp này giữ mã nguồn, bộ nhớ đệm npm và các tệp tạm trên ổ D. Khi màn hình thông báo ứng dụng đã sẵn sàng, mở trình duyệt tại địa chỉ `http://localhost:3000`.

Để chỉ xem và dùng website với tốc độ ổn định, nhấp đúp `run-web.cmd`. Tệp này chạy bản production đã được biên dịch sẵn, nên không có trạng thái `Compiling...` khi mở trang mới. Đóng `run-dev.cmd` trước khi chạy tệp này.

Nếu đang dùng cửa sổ dòng lệnh, chạy:

```cmd
npm.cmd run dev
```

Lệnh `npm.cmd` được dùng để tránh thiết lập PowerShell trên máy chặn lệnh `npm`. Để các tệp tạm cũng nằm ở ổ D khi chạy thủ công, ưu tiên dùng `run-dev.cmd`.

## Kiểm tra bản production

```cmd
npm.cmd run build
npm.cmd run start
```

## Cấu hình Microsoft SQL Server

Project đang dùng SQL Server Express cục bộ, database `MINDCARE`, qua cổng riêng `14330`. File `.env.local` đã được cấu hình trên máy này.

1. Khi chuyển sang máy khác, sao chép `.env.example` thành `.env.local` và thay thông tin SQL Server cùng `AUTH_SECRET`.
2. Áp dụng cấu trúc database:

```cmd
npm.cmd run db:migrate
```

3. Khởi động lại ứng dụng. Đăng ký, đăng nhập, hồ sơ, kết quả DASS-21, lịch hẹn và SOS được lưu trong SQL Server.

`AUTH_SECRET` nên là chuỗi ngẫu nhiên dài ít nhất 32 ký tự. Không đưa `.env.local` lên Git hoặc chia sẻ mật khẩu database.
