@echo off
chcp 65001 >nul
setlocal
set "PATH=%~dp0node;%PATH%"
echo Starting RUSSIAN CUP SEASON 1...
npm run build && npm start
endlocal
pause
