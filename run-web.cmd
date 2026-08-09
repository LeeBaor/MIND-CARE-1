@echo off
setlocal
cd /d "%~dp0"

REM Start the Next.js development server without PowerShell's npm.ps1 wrapper.
node ".\node_modules\next\dist\bin\next" dev
