@echo off
REM Create AgriChain Channel Script

echo ===============================================
echo    Creating AgriChain Channel
echo ===============================================

cd /d "%~dp0.."

echo.
echo [1/3] Creating channel configuration...

REM Create configtx.yaml for channel configuration
if not exist "config\configtx" mkdir config\configtx

(
echo # AgriChain Channel Configuration
echo Organizations:
echo   - &OrdererOrg
echo       Name: OrdererOrg
echo       ID: OrdererMSP
echo       MSPDir: ./orderer/msp
echo       Policies:
echo         Readers:
echo           Type: Signature
echo           Rule: "OR('OrdererMSP.member')"
echo         Writers:
echo           Type: Signature
echo           Rule: "OR('OrdererMSP.member')"
echo         Admins:
echo           Type: Signature
echo           Rule: "OR('OrdererMSP.admin')"
echo       OrdererEndpoints:
echo         - orderer.agrichain.com:7050
echo.
echo   - &Org1
echo       Name: Org1MSP
echo       ID: Org1MSP
echo       MSPDir: ./org1/peer0/msp
echo       Policies:
echo         Readers:
echo           Type: Signature
echo           Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')"
echo         Writers:
echo           Type: Signature
echo           Rule: "OR('Org1MSP.admin', 'Org1MSP.client')"
echo         Admins:
echo           Type: Signature
echo           Rule: "OR('Org1MSP.admin')"
echo         Endorsement:
echo           Type: Signature
echo           Rule: "OR('Org1MSP.peer')"
echo       AnchorPeers:
echo         - Host: peer0.org1.agrichain.com
echo           Port: 7051
echo.
echo   - &Org2
echo       Name: Org2MSP
echo       ID: Org2MSP
echo       MSPDir: ./org2/peer0/msp
echo       Policies:
echo         Readers:
echo           Type: Signature
echo           Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"
echo         Writers:
echo           Type: Signature
echo           Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"
echo         Admins:
echo           Type: Signature
echo           Rule: "OR('Org2MSP.admin')"
echo         Endorsement:
echo           Type: Signature
echo           Rule: "OR('Org2MSP.peer')"
echo       AnchorPeers:
echo         - Host: peer0.org2.agrichain.com
echo           Port: 9051
echo.
echo Capabilities:
echo   Channel: &ChannelCapabilities
echo     V2_0: true
echo   Orderer: &OrdererCapabilities
echo     V2_0: true
echo   Application: &ApplicationCapabilities
echo     V2_0: true
echo.
echo Application: &ApplicationDefaults
echo   Organizations:
echo   Policies:
echo     Readers:
echo       Type: ImplicitMeta
echo       Rule: "ANY Readers"
echo     Writers:
echo       Type: ImplicitMeta
echo       Rule: "ANY Writers"
echo     Admins:
echo       Type: ImplicitMeta
echo       Rule: "MAJORITY Admins"
echo     LifecycleEndorsement:
echo       Type: ImplicitMeta
echo       Rule: "MAJORITY Endorsement"
echo     Endorsement:
echo       Type: ImplicitMeta
echo       Rule: "MAJORITY Endorsement"
echo   Capabilities:
echo     ^<^<: *ApplicationCapabilities
echo.
echo Profiles:
echo   AgriChainChannel:
echo     Consortium: SampleConsortium
echo     ^<^<: *ChannelDefaults
echo     Application:
echo       ^<^<: *ApplicationDefaults
echo       Organizations:
echo         - *Org1
echo         - *Org2
echo       Capabilities:
echo         ^<^<: *ApplicationCapabilities
) > config\configtx\configtx.yaml

echo ✅ Channel configuration created

echo.
echo [2/3] Creating agrichain channel...
docker exec compose_cli_1 bash -c "
export CORE_PEER_LOCALMSPID=Org1MSP && \
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/org1/peer0/msp && \
export CORE_PEER_ADDRESS=peer0.org1.agrichain.com:7051 && \
peer channel create -o orderer.agrichain.com:7050 -c agrichain --ordererTLSHostnameOverride orderer.agrichain.com -f ./channel-artifacts/agrichain.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/orderer/msp/tlscacerts/tlsca.agrichain.com-cert.pem
"

echo ✅ AgriChain channel created

echo.
echo [3/3] Joining peers to channel...
echo Joining Org1 peer...
docker exec compose_cli_1 bash -c "
export CORE_PEER_LOCALMSPID=Org1MSP && \
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/org1/peer0/msp && \
export CORE_PEER_ADDRESS=peer0.org1.agrichain.com:7051 && \
peer channel join -b agrichain.block
"

echo Joining Org2 peer...
docker exec compose_cli_1 bash -c "
export CORE_PEER_LOCALMSPID=Org2MSP && \
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/org2/peer0/msp && \
export CORE_PEER_ADDRESS=peer0.org2.agrichain.com:9051 && \
peer channel join -b agrichain.block
"

echo ✅ Peers joined to AgriChain channel

echo.
echo ===============================================
echo    AgriChain Channel Setup Complete!
echo ===============================================
echo Channel Name: agrichain
echo Organizations: Org1MSP, Org2MSP
echo.
echo Next: Deploy chaincode with scripts\deploy-chaincode.bat

pause