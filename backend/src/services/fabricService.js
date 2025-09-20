const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class FabricService {
    constructor() {
        this.gateway = null;
        this.contract = null;
        this.isConnected = false;
        this.demoMode = process.env.FABRIC_DEMO_MODE === 'true';
        this.demoData = new Map(); // In-memory storage for demo mode
    }

    async connect() {
        // If in demo mode, simulate connection
        if (this.demoMode) {
            console.log('🔧 Fabric running in DEMO MODE (no network required)');
            this.isConnected = true;
            this.initDemoData();
            return;
        }

        try {
            // Create a new file system based wallet for managing identities
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('⚠️ No identity found. Running in demo mode instead.');
                this.demoMode = true;
                this.isConnected = true;
                this.initDemoData();
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
            const network = await this.gateway.getNetwork('mychannel');

            // Get the contract from the network
            this.contract = network.getContract('agrichain');
            
            this.isConnected = true;
            console.log('✅ Connected to Fabric network');
            
        } catch (error) {
            console.error(`⚠️ Failed to connect to Fabric network: ${error.message}`);
            console.log('🔧 Falling back to DEMO MODE');
            this.demoMode = true;
            this.isConnected = true;
            this.initDemoData();
        }
    }

    initDemoData() {
        // Initialize with sample data for demonstration
        const sampleData = [
            {
                id: 'DATA001',
                type: 'harvest',
                farmerId: 'FARMER001',
                cropType: 'wheat',
                quantity: '1000',
                unit: 'kg',
                harvestDate: '2025-09-15',
                location: 'Farm A, District 1',
                quality: 'Grade A',
                timestamp: new Date().toISOString(),
                verified: false,
                docType: 'agriData'
            },
            {
                id: 'DATA002', 
                type: 'processing',
                processorId: 'PROC001',
                sourceDataId: 'DATA001',
                processType: 'milling',
                inputQuantity: '1000',
                outputQuantity: '800',
                outputProduct: 'wheat_flour',
                processDate: '2025-09-16',
                timestamp: new Date().toISOString(),
                verified: false,
                docType: 'agriData'
            }
        ];

        sampleData.forEach(data => {
            this.demoData.set(data.id, data);
        });

        console.log(`📊 Demo mode initialized with ${this.demoData.size} sample records`);
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
        }
        this.isConnected = false;
        console.log('Disconnected from Fabric network');
    }

    // AgriChain specific methods
    async createData(id, type, data) {
        if (this.demoMode) {
            const newData = {
                id,
                type,
                ...data,
                timestamp: new Date().toISOString(),
                verified: false,
                docType: 'agriData'
            };
            this.demoData.set(id, newData);
            console.log(`📝 [DEMO] Created data: ${id}`);
            return newData;
        }

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
        if (this.demoMode) {
            const data = this.demoData.get(id);
            if (!data) {
                throw new Error(`Data ${id} does not exist`);
            }
            console.log(`📖 [DEMO] Retrieved data: ${id}`);
            return data;
        }

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
        if (this.demoMode) {
            const allData = [];
            for (const [key, value] of this.demoData.entries()) {
                allData.push({ Key: key, Record: value });
            }
            console.log(`📚 [DEMO] Retrieved ${allData.length} records`);
            return allData;
        }

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
        if (this.demoMode) {
            const data = this.demoData.get(id);
            if (!data) {
                throw new Error(`Data ${id} does not exist`);
            }
            data.verified = true;
            data.verifiedAt = new Date().toISOString();
            this.demoData.set(id, data);
            console.log(`✅ [DEMO] Verified data: ${id}`);
            return data;
        }

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
        if (this.demoMode) {
            const results = [];
            for (const [key, value] of this.demoData.entries()) {
                if (value.type === type) {
                    results.push({ Key: key, Record: value });
                }
            }
            console.log(`🔍 [DEMO] Found ${results.length} records of type: ${type}`);
            return results;
        }

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
        if (this.demoMode) {
            const data = this.demoData.get(id);
            if (!data) {
                throw new Error(`Data ${id} does not exist`);
            }
            // Return current state as history (demo mode limitation)
            console.log(`📜 [DEMO] Retrieved history for: ${id}`);
            return [data];
        }

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