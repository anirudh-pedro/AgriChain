@echo off
echo ===============================================
echo    Starting AgriChain Fabric Network (Simple)
echo ===============================================

cd /d "%~dp0.."

echo.
echo [1/3] Cleaning up any existing containers...
docker-compose -f compose/docker-compose-simple.yml down -v --remove-orphans >nul 2>&1
echo ✅ Cleanup completed

echo.
echo [2/3] Pulling required Docker images...
docker pull hyperledger/fabric-peer:2.5
docker pull hyperledger/fabric-orderer:2.5  
docker pull hyperledger/fabric-tools:2.5
echo ✅ Images pulled

echo.
echo [3/3] Starting the network...
cd compose
docker-compose -f docker-compose-simple.yml up -d

echo.
echo Waiting for containers to start...
timeout /t 10 /nobreak >nul

echo.
echo ===============================================
echo    Network Status
echo ===============================================
docker ps --filter "label=com.docker.compose.project=compose" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ===============================================
echo    Success! AgriChain Basic Network is Running
echo ===============================================
echo.
echo Available services:
echo - Orderer: localhost:7050
echo - Peer0.Org1: localhost:7051  
echo - CLI: Access with 'docker exec -it compose_cli_1 bash'
echo.
echo Next steps:
echo 1. Test connection: docker exec compose_cli_1 peer version
echo 2. Stop network: docker-compose -f docker-compose-simple.yml down
echo.

pause