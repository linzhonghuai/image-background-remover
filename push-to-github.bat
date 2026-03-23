@echo off
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.

cd /d "%~dp0"
git push -u origin master --force

echo.
echo ========================================
echo Push completed!
echo ========================================
pause
