@echo off
setlocal
cd /d "%~dp0"

REM Production mode: pages are pre-built, so navigation does not pause at "Compiling...".
set "MIND_CARE_CACHE=%~dp0.cache"
if not exist "%MIND_CARE_CACHE%" mkdir "%MIND_CARE_CACHE%"
set "TEMP=%MIND_CARE_CACHE%"
set "TMP=%MIND_CARE_CACHE%"
set "npm_config_cache=%MIND_CARE_CACHE%\npm"

if not exist ".next\BUILD_ID" call npm.cmd run build
call npm.cmd run start
