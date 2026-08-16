@echo off
chcp 65001 > NUL
title MIND-CARE Development Server

echo ===================================================
echo   MIND CARE - KHỞI CHẠY MỘT-CLICK
echo ===================================================
echo.

if not exist .env.local (
    echo [1/3] Tạo tệp cấu hình .env.local từ .env.example...
    copy .env.example .env.local
) else (
    echo [1/3] Tệp .env.local đã tồn tại.
)

if not exist node_modules (
    echo [2/3] Đang cài đặt thư viện (npm install)...
    call npm.cmd install
) else (
    echo [2/3] Thư viện node_modules đã sẵn sàng.
)

echo [3/3] Đang khởi chạy Web Server...
echo Trình duyệt sẽ chạy tại: http://localhost:3000
echo.
call npm.cmd run dev
pause
