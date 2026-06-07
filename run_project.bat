@echo off
title CyberKavach OS Launcher
echo ==========================================
echo       CYBERKAVACH OS PROJECT LAUNCHER
echo ==========================================
echo.

:: 1. Verify Docker Status and spin up Postgres / Redis
echo [*] Step 1: Initializing Postgres and Redis containers...
docker compose -f infra/docker-compose.yml up -d
if %ERRORLEVEL% neq 0 (
    echo [!] Warning: Failed to run docker-compose. Please ensure Docker Desktop is running.
)
echo.

:: 2. Launch Backend Express Server in a new window
echo [*] Step 2: Launching Backend Express Server (port 5000)...
start "CyberKavach OS Backend" cmd /k "cd /d %~dp0backend && npx nodemon src/server.ts"

:: 3. Launch Frontend Next.js Dev Server in a new window
echo [*] Step 3: Launching Frontend Next.js Dev Server (port 3000)...
start "CyberKavach OS Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==========================================
echo [+] Launch Sequence Completed!
echo [i] Backend Gateway: http://localhost:5000/api/v1/health
echo [i] Frontend Console: http://localhost:3000
echo ==========================================
echo.
pause
