@echo off
TITLE Sanad Experts Platform - Launch Dashboard
color 0B

echo ======================================================
echo    SANAD EXPERTS - PLATFORM STARTUP
echo ======================================================
echo.
echo [1/3] Checking dependencies...
if not exist node_modules (
    echo [!] Node modules not found. Installing...
    call npm install
) else (
    echo [OK] Dependencies found.
)

echo.
:: Search for PHP in common drive letters
set PHP_PATH=php
if exist "C:\xampp\php\php.exe" set PHP_PATH="C:\xampp\php\php.exe"
if exist "D:\xampp\php\php.exe" set PHP_PATH="D:\xampp\php\php.exe"
if exist "E:\xampp\php\php.exe" set PHP_PATH="E:\xampp\php\php.exe"

echo [2/3] Starting Backend ^^& Frontend Servers...
echo.
echo TIP: Keep this window open. It is running both servers.
echo.

:: Start PHP server using the found path
start /b "" %PHP_PATH% -S localhost:8000

:: Wait a bit for servers to warm up
timeout /t 3 /nobreak > nul

:: Start the website and admin in default browser
start "" "http://localhost:5177"
start "" "http://localhost:5177/login"

:: Start the Vite server
npm run dev -- --port 5177

pause
