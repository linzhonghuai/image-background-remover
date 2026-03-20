@echo off
echo ========================================
echo Resetting Network Stack...
echo ========================================
echo.

echo Step 1: Flushing DNS...
ipconfig /flushdns

echo.
echo Step 2: Releasing IP...
ipconfig /release

echo.
echo Step 3: Renewing IP...
ipconfig /renew

echo.
echo Step 4: Resetting Winsock...
netsh winsock reset

echo.
echo Step 5: Resetting TCP/IP stack...
netsh int ip reset all

echo.
echo ========================================
echo Network reset complete!
echo Please restart your computer.
echo ========================================
pause
shutdown /r /t 60 /c "Network reset - restarting in 60 seconds. To cancel: shutdown /a"
