@echo off
title MySQL Server (SmartConstruction)
echo Starting MySQL Server with data at F:\UserRelocatedData\mysql-data...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="F:\UserRelocatedData\mysql-data" --console
pause
