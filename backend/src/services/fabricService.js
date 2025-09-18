const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class FabricService {
    constructor() {
        this.gateway = null;
        this.contract = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            // Create a new file system based wallet for managing identities
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node
            this.gateway = new Gateway();
            const connectionProfile = this.buildConnectionProfile();
            const connectionOptions = { 
                wallet, 
                identity: 'appUser', 
                discovery: { enabled: true, asLocalhost: true }
            };
            
            await this.gateway.connect(connectionProfile, connectionOptions);

            // Get the network (channel) our contract is deployed to
            const network = await this.gateway.getNetwork('agrichain');

            // Get the contract from the network
            this.contract = network.getContract('agrichain');
            
            this.isConnected = true;
            console.log('✅ Connected to Fabric network');
            
        } catch (error) {
            console.error(`❌ Failed to connect to Fabric network: ${error}`);
            throw error;
        }
    }

    buildConnectionProfile() {
        // Build connection profile for AgriChain network
        return {
            name: 'agrichain-network',
            version: '1.0.0',
            client: {
                organization: 'Org1',
                connection: {
                    timeout: {
                        peer: {
                            endorser: '300'
                        }
                    }
                }
            },
            organizations: {
                Org1: {
                    mspid: 'Org1MSP',
                    peers: ['peer0.org1.agrichain.com'],
                    certificateAuthorities: ['ca.org1.agrichain.com']
                }
            },
            peers: {
                'peer0.org1.agrichain.com': {
                    url: 'grpc://localhost:7051',
                    eventUrl: 'grpc://localhost:7053'
                }
            },
            certificateAuthorities: {
                'ca.org1.agrichain.com': {
                    url: 'http://localhost:7054',
                    caName: 'ca.org1.agrichain.com'
                }
            }
        };
    }

    async disconnect() {
        if (this.gateway) {
            await this.gateway.disconnect();
            this.isConnected = false;
            console.log('Disconnected from Fabric network');
        }
    }

    // AgriChain specific methods
    async createData(id, type, data) {
        if (!this.contract) {
            throw new Error('Not connected to Fabric network');
        }
        
        try {
            const result = await this.contract.submitTransaction('createData', id, type, JSON.stringify(data));
            console.log('Transaction has been submitted');
            return JSON.parse(result.toString());
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            throw error;
        }
    }

    async queryData(id) {
        if (!this.contract) {
            throw new Error('Not connected to Fabric network');
        }
        
        try {
            const result = await this.contract.evaluateTransaction('queryData', id);
            return JSON.parse(result.toString());
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            throw error;
        }
    }

    async queryAllData() {
        if (!this.contract) {
            throw new Error('Not connected to Fabric network');
        }
        
        try {
            const result = await this.contract.evaluateTransaction('queryAllData');
            return JSON.parse(result.toString());
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            throw error;
        }
    }

    async verifyData(id) {
        if (!this.contract) {
            throw new Error('Not connected to Fabric network');
        }
        
        try {
            const result = await this.contract.submitTransaction('verifyData', id);
            return JSON.parse(result.toString());
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            throw error;
        }
    }

    async queryDataByType(type) {
        if (!this.contract) {
            throw new Error('Not connected to Fabric network');
        }
        
        try {
            const result = await this.contract.evaluateTransaction('queryDataByType', type);
            return JSON.parse(result.toString());
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            throw error;
        }
    }

    async getDataHistory(id) {
        if (!this.contract) {
            throw new Error('Not connected to Fabric network');
        }
        
        try {
            const result = await this.contract.evaluateTransaction('getDataHistory', id);
            return JSON.parse(result.toString());
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            throw error;
        }
    }
}

module.exports = FabricService;