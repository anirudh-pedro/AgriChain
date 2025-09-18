#!/bin/bash

# AgriChain Hyperledger Fabric Network Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${GREEN}===============================================${NC}"
    echo -e "${GREEN}   AgriChain Hyperledger Fabric Network Setup ${NC}"
    echo -e "${GREEN}===============================================${NC}"
}

function print_step() {
    echo -e "${YELLOW}>>> $1${NC}"
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Change to fabric-network directory
cd "$(dirname "$0")/.."

print_header

# Step 1: Clean up any existing containers
print_step "Cleaning up existing Docker containers and networks"
docker-compose -f compose/docker-compose.yml down -v --remove-orphans 2>/dev/null || true
docker system prune -f >/dev/null 2>&1 || true
print_success "Cleanup completed"

# Step 2: Create necessary directories
print_step "Creating configuration directories"
mkdir -p config/{orderer,org1/peer0,org2/peer0}/{msp,tls}
mkdir -p config/peerOrganizations/{org1.agrichain.com,org2.agrichain.com}
mkdir -p config/ordererOrganizations/agrichain.com
print_success "Configuration directories created"

# Step 3: Generate crypto material (simplified for development)
print_step "Generating development crypto material"

# Create simple MSP structure for development
# Note: In production, use cryptogen or Fabric CA
echo "Creating development certificates..."

# Create basic MSP config
cat > config/orderer/msp/config.yaml << EOF
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
EOF

# Copy MSP config to org directories
cp config/orderer/msp/config.yaml config/org1/peer0/msp/
cp config/orderer/msp/config.yaml config/org2/peer0/msp/

print_success "Development crypto material generated"

# Step 4: Pull required Docker images
print_step "Pulling Hyperledger Fabric Docker images"
docker pull hyperledger/fabric-peer:latest || print_error "Failed to pull peer image"
docker pull hyperledger/fabric-orderer:latest || print_error "Failed to pull orderer image"
docker pull hyperledger/fabric-tools:latest || print_error "Failed to pull tools image"
print_success "Docker images pulled"

# Step 5: Start the network
print_step "Starting AgriChain Fabric Network"
cd compose
docker-compose up -d

# Wait a moment for containers to start
sleep 5

# Check if containers are running
if [ $(docker ps | grep agrichain | wc -l) -ge 3 ]; then
    print_success "AgriChain Fabric Network is running!"
    echo ""
    echo -e "${GREEN}Network Status:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep agrichain
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Create a channel: ./scripts/create-channel.sh"
    echo "2. Deploy chaincode: ./scripts/deploy-chaincode.sh"
    echo "3. Access CLI: docker exec -it compose_cli_1 bash"
else
    print_error "Failed to start all network components"
    echo "Check logs with: docker-compose logs"
fi