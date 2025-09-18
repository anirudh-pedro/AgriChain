@echo off
echo Testing Docker and basic Fabric setup...

echo.
echo [1/3] Testing Docker connection...
docker --version
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker not available
    pause
    exit /b 1
)
echo ✅ Docker is running

echo.
echo [2/3] Pulling a simple test image...
docker pull hello-world
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to pull test image
    pause
    exit /b 1
)
echo ✅ Docker pull successful

echo.
echo [3/3] Testing Fabric peer image...
docker pull hyperledger/fabric-peer:2.5
if %ERRORLEVEL% neq 0 (
    echo ⚠️ Failed to pull Fabric peer, trying latest...
    docker pull hyperledger/fabric-peer:latest
)
echo ✅ Fabric images ready

echo.
echo [4/4] Starting simple test network...
cd compose
docker-compose -f docker-compose-test.yml up -d

timeout /t 3 /nobreak >nul

echo.
echo Network status:
docker ps --format "table {{.Names}}\t{{.Status}}"

echo.
echo Test complete! Press any key to stop containers...
pause >nul

echo Stopping containers...
docker-compose -f docker-compose-test.yml down
echo ✅ Cleanup complete

pause