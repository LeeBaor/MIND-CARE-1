# MINDCARE

Nền tảng hỗ trợ chăm sóc sức khỏe tinh thần, gồm đăng ký/đăng nhập, hồ sơ cá nhân, sàng lọc DASS-21, kết quả đánh giá, đặt lịch, quản lý buổi tham vấn, thông báo và SOS.

## Yêu cầu

- Windows 10 hoặc Windows 11.
- Node.js 20 trở lên và npm.
- Microsoft SQL Server đang hoạt động.
- SQL Server Management Studio chỉ dùng để quản lý; website kết nối trực tiếp tới SQL Server.
- Mã nguồn đặt tại `D:\Admin\mind-care-1` để tránh chiếm dung lượng ổ C.

Kiểm tra Node.js và npm:

```cmd
node --version
npm.cmd --version
```

## Cài đặt lần đầu

1. Mở Command Prompt hoặc PowerShell tại `D:\Admin\mind-care-1`.
2. Sao chép `.env.example` thành `.env.local` và điền thông tin SQL Server.
3. Chạy lệnh thiết lập tự động:

```cmd
npm.cmd run setup
```

Lệnh này cài đúng dependency trong `package-lock.json`, tạo/cập nhật cấu trúc database và build bản production.

## Cấu hình `.env.local`

```env
DB_SERVER=127.0.0.1
DB_PORT=14330
DB_INSTANCE=
DB_NAME=MINDCARE
DB_USER=mindcare_app
DB_PASSWORD=mat-khau-sql-server
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true
COOKIE_SECURE=false
EXPERT_REGISTRATION_CODE=ma-moi-chuyen-gia-rieng
AUTH_SECRET=chuoi-ngau-nhien-dai-it-nhat-32-ky-tu
```

- Không đưa `.env.local` lên GitHub.
- Khi chạy HTTPS thật, đổi `COOKIE_SECURE=true`.
- Nếu dùng SQL Server instance thay vì cổng TCP, điền `DB_INSTANCE` và kiểm tra lại cấu hình kết nối.

## Chạy website

### Chạy nhanh và ổn định

Nhấp đúp `run-web.cmd`, sau đó mở [http://localhost:3000](http://localhost:3000). Đây là bản production đã build nên chuyển trang mượt hơn và không phải biên dịch lại từng trang.

Nếu vừa sửa mã nguồn, build lại trước:

```cmd
npm.cmd run build
```

### Chạy để phát triển

Nhấp đúp `run-dev.cmd`, hoặc chạy:

```cmd
npm.cmd run dev
```

Chế độ này có thể chậm hơn ở lần mở trang đầu vì Next.js phải biên dịch trang.

## Các lệnh cần dùng

```cmd
npm.cmd install             Cài/cập nhật dependency
npm.cmd run db:migrate      Áp dụng migration SQL Server
npm.cmd run typecheck       Kiểm tra lỗi TypeScript
npm.cmd run build           Tạo bản production
npm.cmd run check           Kiểm tra TypeScript và build
npm.cmd run start           Chạy bản production đã build
```

Project Node.js không sử dụng `requirements.txt` như Python. Danh sách requirement nằm trong `package.json`, còn phiên bản chính xác được khóa trong `package-lock.json`.

## Xử lý lỗi thường gặp

- Không kết nối được database: kiểm tra dịch vụ SQL Server, TCP/IP, cổng, tài khoản và mật khẩu trong `.env.local`.
- Cổng 3000 đang được sử dụng: đóng cửa sổ MINDCARE cũ rồi chạy lại.
- Trang vẫn giữ phiên bản cũ: đóng server, chạy `npm.cmd run build`, sau đó mở lại `run-web.cmd`.
- Thiếu package: chạy `npm.cmd install` tại đúng thư mục project trên ổ D.

## Bảo mật

- Không commit `.env.local`, mật khẩu SQL Server hoặc mã mời chuyên gia.
- Dùng `AUTH_SECRET` riêng cho từng môi trường.
- Sao lưu database `MINDCARE` trước khi cập nhật production.
- Kết quả sàng lọc chỉ hỗ trợ tham khảo, không thay thế chẩn đoán chuyên môn.
