@echo off
chcp 65001 > nul
setlocal EnableExtensions

set "PROJECT_DIR=%~dp0daekwang-tech-final-exact-no-form"

if exist "%PROJECT_DIR%\START_HERE.cmd" (
  cd /d "%PROJECT_DIR%"
  call "%PROJECT_DIR%\START_HERE.cmd"
  exit /b %errorlevel%
)

echo [HOLD] 프로젝트 폴더를 찾지 못했습니다.
echo 예상 경로: %PROJECT_DIR%
echo 압축을 정상적으로 풀었는지 확인하세요.
pause
exit /b 1
