@echo off
rem Waits for the preview to be ready, then opens it in a phone-sized Edge window.
:wait
curl -s -o nul http://localhost:8081
if errorlevel 1 (
  timeout /t 2 /nobreak >nul
  goto wait
)
start "" msedge --app=http://localhost:8081 --window-size=430,932 --user-data-dir="%LOCALAPPDATA%\HealthMaxingPreview"
