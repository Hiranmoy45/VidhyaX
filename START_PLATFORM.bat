@echo off
title PW Learning Hub - Next.js Full Course Platform
cd /d "%~dp0"

echo ======================================================================
echo           PW Learning Hub - Professional Learning Platform
echo ======================================================================
echo.
echo Starting Next.js Web Server on http://localhost:3000 ...
echo.

start "" "http://localhost:3000"
npm run dev

pause

