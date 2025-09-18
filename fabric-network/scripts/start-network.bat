@echo off
REM AgriChain Hyperledger Fabric Network Setup Script for Windows

echo ===============================================
echo    AgriChain Hyperledger Fabric Network Setup
echo ===============================================

cd /d "%~dp0.."

echo.
echo [1/5] Cleaning up existing Docker containers and networks...
docker-compose -f compose/docker-compose.yml down -v --remove-orphans >nul 2>&1
docker system prune -f >nul 2>&1
echo ✅ Cleanup completed

echo.
echo [2/5] Creating configuration directories...
if not exist "config\orderer\msp" mkdir config\orderer\msp
if not exist "config\orderer\tls" mkdir config\orderer\tls
if not exist "config\org1\peer0\msp" mkdir config\org1\peer0\msp
if not exist "config\org1\peer0\tls" mkdir config\org1\peer0\tls
if not exist "config\org2\peer0\msp" mkdir config\org2\peer0\msp
if not exist "config\org2\peer0\tls" mkdir config\org2\peer0\tls
echo ✅ Configuration directories created

echo.
echo [3/5] Creating development MSP configuration...
(
echo NodeOUs:
echo   Enable: true
echo   ClientOUIdentifier:
echo     Certificate: cacerts/ca.crt
echo     OrganizationalUnitIdentifier: client
echo   PeerOUIdentifier:
echo     Certificate: cacerts/ca.crt
echo     OrganizationalUnitIdentifier: peer
echo   AdminOUIdentifier:
echo     Certificate: cacerts/ca.crt
echo     OrganizationalUnitIdentifier: admin
echo   OrdererOUIdentifier:
echo     Certificate: cacerts/ca.crt
echo     OrganizationalUnitIdentifier: orderer
) > config\orderer\msp\config.yaml

copy config\orderer\msp\config.yaml config\org1\peer0\msp\ >nul
copy config\orderer\msp\config.yaml config\org2\peer0\msp\ >nul
echo ✅ Development MSP configuration created

echo.
echo [4/5] Pulling Hyperledger Fabric Docker images...
echo This may take a few minutes...
docker pull hyperledger/fabric-peer:latest
docker pull hyperledger/fabric-orderer:latest
docker pull hyperledger/fabric-tools:latest
echo ✅ Docker images pulled

echo.
echo [5/5] Starting AgriChain Fabric Network...
cd compose
docker-compose up -d

echo.
echo Waiting for containers to start...
timeout /t 10 /nobreak >nul

echo.
echo ===============================================
echo    Network Status
echo ===============================================
docker ps --filter "name=compose" --format "table {{.Names}}\t{{.Status}}"

echo.
echo ===============================================
echo    Next Steps
echo ===============================================
echo 1. Create channel: scripts\create-channel.bat
echo 2. Check logs: docker-compose logs
echo 3. Access CLI: docker exec -it compose_cli_1 bash
echo.
echo AgriChain Fabric Network setup complete!

pause