@echo off
chcp 65001 > nul
setlocal EnableExtensions

REM ============================================================
REM DAEKWANG TECH START LAUNCHER
REM Double-click this file from the project folder.
REM It always switches to the folder where this file exists.
REM ============================================================

cd /d "%~dp0"
set "PROJECT_DIR=%cd%"
set "APP_URL=http://localhost:4173/#/home"
set "COMPANY_URL=http://localhost:4173/#/company"
set "ADMIN_URL=http://localhost:4173/#/admin/dashboard"

title DAEKWANG TECH Launcher

echo.
echo ============================================================
echo  DAEKWANG TECH 종합 스타트 런처
echo ============================================================
echo  프로젝트 폴더: %PROJECT_DIR%
echo.

if not exist "%PROJECT_DIR%\package.json" (
  echo [HOLD] package.json을 찾지 못했습니다.
  echo 이 런처는 프로젝트 루트 폴더 안에서 실행되어야 합니다.
  echo 현재 폴더: %PROJECT_DIR%
  echo.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [HOLD] Node.js가 설치되어 있지 않거나 PATH에 없습니다.
  echo Node.js LTS 설치 후 다시 실행하세요.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [HOLD] npm을 찾지 못했습니다. Node.js 설치 상태를 확인하세요.
  echo.
  pause
  exit /b 1
)

:MENU
echo.
echo ------------------------------------------------------------
echo  선택하세요
echo ------------------------------------------------------------
echo  1. 개발 서버 실행 + 홈 화면 열기
echo  2. Admin 콘솔 열기
echo  3. 회사소개 화면 열기
echo  4. Build 실행
echo  5. Verify 실행
echo  6. Build + Verify 연속 실행
echo  7. 프로젝트 폴더 열기
echo  8. 종료
echo ------------------------------------------------------------
set /p choice=번호 입력 후 Enter:

if "%choice%"=="1" goto START_DEV
if "%choice%"=="2" goto OPEN_ADMIN
if "%choice%"=="3" goto OPEN_COMPANY
if "%choice%"=="4" goto BUILD
if "%choice%"=="5" goto VERIFY
if "%choice%"=="6" goto BUILD_VERIFY
if "%choice%"=="7" goto OPEN_FOLDER
if "%choice%"=="8" goto END

echo 잘못된 입력입니다.
goto MENU

:START_DEV
echo.
echo [GO] 개발 서버를 새 창에서 실행합니다.
echo URL: %APP_URL%
start "DAEKWANG DEV SERVER" cmd /k "cd /d ""%PROJECT_DIR%"" && npm run dev"
timeout /t 2 /nobreak >nul
start "" "%APP_URL%"
goto MENU

:OPEN_ADMIN
echo.
echo [GO] Admin 콘솔을 엽니다. 서버가 꺼져 있으면 먼저 1번을 실행하세요.
start "" "%ADMIN_URL%"
goto MENU

:OPEN_COMPANY
echo.
echo [GO] 회사소개 화면을 엽니다. 서버가 꺼져 있으면 먼저 1번을 실행하세요.
start "" "%COMPANY_URL%"
goto MENU

:BUILD
echo.
echo [GO] Build 실행
call npm run build
if errorlevel 1 (
  echo [HOLD] Build 실패
) else (
  echo [PASS] Build 완료
)
pause
goto MENU

:VERIFY
echo.
echo [GO] Verify 실행
call npm run verify
if errorlevel 1 (
  echo [HOLD] Verify 실패
) else (
  echo [PASS] Verify 완료
)
pause
goto MENU

:BUILD_VERIFY
echo.
echo [GO] Build + Verify 실행
call npm run build
if errorlevel 1 (
  echo [HOLD] Build 실패. Verify로 넘어가지 않습니다.
  pause
  goto MENU
)
call npm run verify
if errorlevel 1 (
  echo [HOLD] Verify 실패
) else (
  echo [PASS] Build + Verify 완료
)
pause
goto MENU

:OPEN_FOLDER
start "" "%PROJECT_DIR%"
goto MENU

:END
echo 종료합니다.
exit /b 0
