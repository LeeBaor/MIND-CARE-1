# Mind Care

## Chạy dự án trên Windows

Nhấp đúp vào `run-dev.cmd` trong thư mục dự án. Tệp này giữ mã nguồn, bộ nhớ đệm npm và các tệp tạm trên ổ D. Khi màn hình thông báo ứng dụng đã sẵn sàng, mở trình duyệt tại địa chỉ `http://localhost:3000`.

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
