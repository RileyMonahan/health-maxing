@echo off
title Health Maxing preview
cd /d "%~dp0"

where node >/dev/null 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed yet. Install the LTS version from https://nodejs.org and then double-click this file again.
  echo.
  pause
  exit /b
)

echo.
echo Getting the app ready. The first time this can take a few minutes...
echo.
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo Something went wrong while getting the app ready. Send a screenshot of this window to Claude.
  pause
  exit /b
)

echo.
echo Starting the preview. A phone-sized window will open in a moment.
echo Keep this black window open while you use the preview. Close it to stop.
echo.
start "" /min cmd /c "scripts\open-phone-window.bat"
call npx expo start --port 8081
