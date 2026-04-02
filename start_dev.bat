@echo off
title SanadXperts Development Servers
color 0A

echo ===================================================
echo   Starting SanadXperts Development Environment
echo ===================================================
echo.

echo [1/2] Starting PHP Backend Server on localhost:8000...
:: يبحث عن مسار PHP في الأماكن الشائعة أو في PATH
set PHP_CMD=php
where php >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\xampp\php\php.exe" ( set PHP_CMD=C:\xampp\php\php.exe )
    if exist "D:\xampp\php\php.exe" ( set PHP_CMD=D:\xampp\php\php.exe )
    if exist "W:\xampp\php\php.exe" ( set PHP_CMD=W:\xampp\php\php.exe )
)
start "SanadXperts - PHP Backend" cmd /k "%PHP_CMD% -S localhost:8000"

echo [2/2] Starting Vite Frontend Server...
:: يبدأ تشغيل سيرفر فاينت الخاص بـ ريآكت
start "SanadXperts - React Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo All services are booting up in separate windows!
echo ===================================================
echo.
echo - Frontend UI will be at:  http://localhost:5176 (Check React Terminal)
echo - Backend API is at:       http://localhost:8000/backend/api/
echo.
echo Close those windows to stop the servers.
pause
