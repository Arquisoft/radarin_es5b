echo off
set /p CREDENTIALS= <..\passwords\mongoAdminCredentials.txt
mongo --host 127.0.0.1 --port 5050 %CREDENTIALS%
echo on