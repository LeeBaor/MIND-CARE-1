@echo off
cd /d "%~dp0"
set "MIND_CARE_CACHE=%~dp0.cache"
if not exist "%MIND_CARE_CACHE%" mkdir "%MIND_CARE_CACHE%"
set "TEMP=%MIND_CARE_CACHE%"
set "TMP=%MIND_CARE_CACHE%"
set "npm_config_cache=%MIND_CARE_CACHE%\npm"
call npm.cmd run dev
