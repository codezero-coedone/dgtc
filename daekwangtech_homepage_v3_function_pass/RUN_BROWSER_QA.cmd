@echo off
cd /d "%~dp0"
echo [1/2] Building...
call npm run build
if errorlevel 1 pause & exit /b 1
echo [2/2] Running real Edge/Chrome browser QA...
call npm run verify:browser
echo.
echo If PASS is shown, real browser route/hit-test/modal checks succeeded.
pause
