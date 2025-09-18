# AgriChain Fabric Network Startup Script (PowerShell)
# This script starts a simple Hyperledger Fabric network for AgriChain

Write-Host "===============================================" -ForegroundColor Green
Write-Host "   AgriChain Hyperledger Fabric Network Setup" -ForegroundColor Green  
Write-Host "===============================================" -ForegroundColor Green

# Step 1: Clean up any existing containers
Write-Host "`n[1/5] Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose -f compose/docker-compose.yml down -v --remove-orphans 2>$null
docker system prune -f >$null 2>&1
Write-Host "✅ Cleanup completed" -ForegroundColor Green

# Step 2: Pull required Docker images
Write-Host "`n[2/5] Pulling Hyperledger Fabric Docker images..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..."

$images = @(
    "hyperledger/fabric-peer:2.5",
    "hyperledger/fabric-orderer:2.5", 
    "hyperledger/fabric-tools:2.5",
    "hyperledger/fabric-ccenv:2.5"
)

foreach ($image in $images) {
    Write-Host "Pulling $image..." -ForegroundColor Cyan
    docker pull $image
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $image pulled successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Failed to pull $image, using latest tag" -ForegroundColor Yellow
        $latestImage = $image -replace ":2.5", ":latest"
        docker pull $latestImage
    }
}

# Step 3: Create minimal crypto material and network configuration
Write-Host "`n[3/5] Setting up network configuration..." -ForegroundColor Yellow

# Create directories
$dirs = @(
    "config/orderer/msp/admincerts",
    "config/orderer/msp/cacerts", 
    "config/orderer/msp/signcerts",
    "config/orderer/msp/keystore",
    "config/orderer/msp/tlscacerts",
    "config/orderer/tls",
    "config/org1/peer0/msp/admincerts",
    "config/org1/peer0/msp/cacerts",
    "config/org1/peer0/msp/signcerts", 
    "config/org1/peer0/msp/keystore",
    "config/org1/peer0/msp/tlscacerts",
    "config/org1/peer0/tls",
    "config/org2/peer0/msp/admincerts",
    "config/org2/peer0/msp/cacerts",
    "config/org2/peer0/msp/signcerts",
    "config/org2/peer0/msp/keystore", 
    "config/org2/peer0/msp/tlscacerts",
    "config/org2/peer0/tls"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force >$null
}

# Create minimal MSP configuration
$mspConfig = @"
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca.crt
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca.crt
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca.crt
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca.crt
    OrganizationalUnitIdentifier: orderer
"@

$mspConfig | Out-File -FilePath "config/orderer/msp/config.yaml" -Encoding UTF8
$mspConfig | Out-File -FilePath "config/org1/peer0/msp/config.yaml" -Encoding UTF8  
$mspConfig | Out-File -FilePath "config/org2/peer0/msp/config.yaml" -Encoding UTF8

Write-Host "✅ Network configuration created" -ForegroundColor Green

# Step 4: Generate development certificates using OpenSSL (if available) or create dummy files
Write-Host "`n[4/5] Creating development certificates..." -ForegroundColor Yellow

# Create dummy certificate files for development
$dummyCert = @"
-----BEGIN CERTIFICATE-----
MIICQDCCAeagAwIBAgIRANKVxL4CwxHJ2MJeKg0lk6EwCgYIKoZIzj0EAwIwczEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG
cmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuYWdyaWNoYWluLmNvbTEcMBoGA1UEAxMT
Y2Eub3JnMS5hZ3JpY2hhaW4uY29tMB4XDTE5MDcyMjEyMDc0NloXDTI5MDcxOTEy
MDc0NlowczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNV
BAcTDVNhbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuYWdyaWNoYWluLmNvbTEc
MBoGA1UEAxMTY2Eub3JnMS5hZ3JpY2hhaW4uY29tMFkwEwYHKoZIzj0CAQYIKoZI
zj0DAQcDQgAE42CwOA0YWjRMOj4t+SLVGHCsLFGDlBg+J8cQQE4BqGPW0dO4FfOr
j4+HWmHGXmzj4f1UL1LEfL9ZQdcZQ7xq3aN/MH0wDgYDVR0PAQH/BAQDAgEGMA8G
A1UdEwEB/wQFMAMBAf8wKQYDVR0OBCIEIDCfhCvKlYhjj1ZjjONNnLFWQKtfSQ4p
FqMeMlHWbf4NMCsGA1UdEQQkMCKCEG9yZzEuYWdyaWNoYWluLmNvbYIOYWdyaWNo
YWluLmNvbTAKBggqhkjOPQQDAgNIADBFAiEAwqGBCFR1HPqWJtlqpFwFEMgEbQFY
VG1yyM0xNh3GNQECIGB9CfLf4Qg1tVKOLUPQ0qJ4x4XDqbFHo+VqGd9lF6oK
-----END CERTIFICATE-----
"@

$dummyKey = @"
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg+V3q8v1J8UrJhPh6
6gNRpICtq4TT1cUt7pKhPkhQyaShRANCAATjYLA4DRhaNEw6Pi35ItUYcKwsUYOU
GD4nxxBATgGoY9bR07gV86uPj4daYcZebOPh/VQvUsR8v1lB1xlDvGrd
-----END PRIVATE KEY-----
"@

# Create certificate files for all components
$certPaths = @(
    "config/orderer/msp/cacerts/ca.crt",
    "config/orderer/msp/signcerts/server.crt", 
    "config/orderer/tls/server.crt",
    "config/orderer/tls/ca.crt",
    "config/org1/peer0/msp/cacerts/ca.crt",
    "config/org1/peer0/msp/signcerts/server.crt",
    "config/org1/peer0/tls/server.crt", 
    "config/org1/peer0/tls/ca.crt",
    "config/org2/peer0/msp/cacerts/ca.crt",
    "config/org2/peer0/msp/signcerts/server.crt",
    "config/org2/peer0/tls/server.crt",
    "config/org2/peer0/tls/ca.crt"
)

foreach ($path in $certPaths) {
    $dummyCert | Out-File -FilePath $path -Encoding UTF8
}

$keyPaths = @(
    "config/orderer/tls/server.key",
    "config/org1/peer0/tls/server.key", 
    "config/org2/peer0/tls/server.key"
)

foreach ($path in $keyPaths) {
    $dummyKey | Out-File -FilePath $path -Encoding UTF8
}

Write-Host "✅ Development certificates created" -ForegroundColor Green

# Step 5: Start the network
Write-Host "`n[5/5] Starting AgriChain Fabric Network..." -ForegroundColor Yellow
Set-Location compose
docker-compose up -d

Start-Sleep -Seconds 5

# Check network status
Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "   Network Status" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

$containers = docker ps --filter "name=compose" --format "table {{.Names}}\t{{.Status}}"
if ($containers) {
    Write-Host $containers
    Write-Host "`n✅ AgriChain Fabric Network is running!" -ForegroundColor Green
    
    Write-Host "`n===============================================" -ForegroundColor Yellow
    Write-Host "   Next Steps" -ForegroundColor Yellow  
    Write-Host "===============================================" -ForegroundColor Yellow
    Write-Host "1. Create channel: ..\scripts\create-channel.bat" -ForegroundColor Cyan
    Write-Host "2. Check logs: docker-compose logs" -ForegroundColor Cyan
    Write-Host "3. Access CLI: docker exec -it compose_cli_1 bash" -ForegroundColor Cyan
    Write-Host "4. Stop network: docker-compose down" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to start network containers" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")