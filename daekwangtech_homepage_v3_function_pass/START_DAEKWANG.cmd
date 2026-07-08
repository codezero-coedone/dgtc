@echo off
chcp 65001 > nul
setlocal EnableExtensions
cd /d "%~dp0"
set "ROOT_DIR=%cd%"
set "PROJECT_DIR=%ROOT_DIR%"
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%ROOT_DIR%\daekwang-tech-company-only-final\package.json" set "PROJECT_DIR=%ROOT_DIR%\daekwang-tech-company-only-final"
)
if not exist "%PROJECT_DIR%\package.json" (
  for /d %%D in ("%ROOT_DIR%\*") do (
    if exist "%%~fD\package.json" set "PROJECT_DIR=%%~fD"
  )
)
cd /d "%PROJECT_DIR%"
set "BASE_URL=http://localhost:4173"
set "HOME_URL=%BASE_URL%/#/home"
set "COMPANY_URL=%BASE_URL%/#/company"
set "PRODUCTS_URL=%BASE_URL%/#/products"
set "FACILITIES_URL=%BASE_URL%/#/facilities"
set "QUALITY_URL=%BASE_URL%/#/quality"
set "ADMIN_URL=%BASE_URL%/#/admin/dashboard"
title DAEKWANG TECH Company Homepage Launcher

echo.
echo ============================================================
echo  DAEKWANG TECH 회사소개 홈페이지 종합 스타트 런처
echo ============================================================
echo  프로젝트 폴더: %PROJECT_DIR%
echo  정책: 문의/contact route OUT, 회사소개/가공/제품/설비/품질 중심
echo  정리: Desktop/Mobile/Admin 전체 기능 고도화 최종판
echo.

if not exist "%PROJECT_DIR%\package.json" (
  echo [HOLD] package.json을 찾지 못했습니다.
  echo 현재 폴더: %PROJECT_DIR%
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo [HOLD] Node.js가 설치되어 있지 않거나 PATH에 없습니다.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [HOLD] npm을 찾지 못했습니다.
  pause
  exit /b 1
)

:MENU
echo.
echo ------------------------------------------------------------
echo  선택하세요
echo ------------------------------------------------------------
echo  1. 개발 서버 실행 + 홈 열기
echo  2. Admin 콘솔 열기
echo  3. 회사소개 화면 열기
echo  11. 운영고도화 센터 열기
echo  12. 전체 기능 최종판 안내
echo  4. 제품·가공사례 열기
echo  5. 설비현황 열기
echo  6. 품질관리 열기
echo  7. Build 실행
echo  8. Verify 실행
echo  9. Build + Verify 연속 실행
echo  10. 프로젝트 폴더 열기
echo  0. 종료
echo ------------------------------------------------------------
set /p choice=번호 입력 후 Enter: 

if "%choice%"=="1" goto START_DEV
if "%choice%"=="2" goto OPEN_ADMIN
if "%choice%"=="3" goto OPEN_COMPANY
if "%choice%"=="4" goto OPEN_PRODUCTS
if "%choice%"=="5" goto OPEN_FACILITIES
if "%choice%"=="6" goto OPEN_QUALITY
if "%choice%"=="7" goto BUILD
if "%choice%"=="8" goto VERIFY
if "%choice%"=="9" goto BUILD_VERIFY
if "%choice%"=="10" goto OPEN_FOLDER
if "%choice%"=="11" goto OPEN_OPS
if "%choice%"=="12" goto FULL_INFO
if "%choice%"=="0" goto END
echo 잘못된 입력입니다.
goto MENU

:START_DEV
echo [GO] 개발 서버를 새 창에서 실행합니다.
start "DAEKWANG DEV SERVER" cmd /k "cd /d ""%PROJECT_DIR%"" && npm run dev"
timeout /t 2 /nobreak >nul
start "" "%HOME_URL%"
goto MENU
:OPEN_ADMIN
start "" "%ADMIN_URL%"
goto MENU
:OPEN_COMPANY
start "" "%COMPANY_URL%"
goto MENU
:OPEN_PRODUCTS
start "" "%PRODUCTS_URL%"
goto MENU
:OPEN_FACILITIES
start "" "%FACILITIES_URL%"
goto MENU
:OPEN_QUALITY
start "" "%QUALITY_URL%"
goto MENU
:BUILD
call npm run build
if errorlevel 1 (echo [HOLD] Build 실패) else (echo [PASS] Build 완료)
pause
goto MENU
:VERIFY
call npm run verify
if errorlevel 1 (echo [HOLD] Verify 실패) else (echo [PASS] Verify 완료)
pause
goto MENU
:BUILD_VERIFY
call npm run build
if errorlevel 1 (echo [HOLD] Build 실패. Verify 중단.& pause& goto MENU)
call npm run verify
if errorlevel 1 (echo [HOLD] Verify 실패) else (echo [PASS] Build + Verify 완료)
pause
goto MENU
:OPEN_OPS
start "" "%BASE_URL%/#/admin/ops"
goto MENU
:OPEN_FOLDER
start "" "%PROJECT_DIR%"
goto MENU
:FULL_INFO
echo.
echo [CT-U1~U10] Desktop/Mobile/Admin 전체 기능 고도화 최종판입니다.
echo - 데스크탑: 사진/패널/CTA hotspot + 상세 모달
echo - 모바일: 터치 상세/이미지 확대/bottom sheet/safe-area 보정
echo - Admin: CMS/백업/복구/미저장 표시/이미지 미리보기
echo - 문의/contact route OUT 유지
pause
goto MENU
:END
echo 종료합니다.
exit /b 0
