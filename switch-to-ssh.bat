@echo off
echo ========================================
echo Switching to SSH for Git...
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Removing HTTPS remote...
git remote remove origin

echo Step 2: Adding SSH remote...
git remote add origin git@github.com:linzhonghuai/image-background-remover.git

echo Step 3: Testing SSH connection...
ssh -T git@github.com

echo.
echo ========================================
echo Now try pushing in GitHub Desktop!
echo ========================================
pause
