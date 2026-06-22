@echo off
echo Starting PlagCheck Backend (Flask)...
start "Flask Backend" cmd /k "cd /d %~dp0 && python app.py"
echo.
echo Waiting for backend to initialise...
timeout /t 3 /nobreak > nul
echo Starting PlagCheck Frontend (Vite)...
start "Vite Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"
echo.
echo Visit http://localhost:5173 in your browser.
