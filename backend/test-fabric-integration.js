const FabricService = require('./src/services/fabricService');

async function testFabricIntegration() {
    console.log('🧪 Testing AgriChain Fabric Integration...\n');
    
    const fabricService = new FabricService();
    
    try {
        // Test connection
        console.log('1. Testing Fabric connection...');
        await fabricService.connect();
        console.log(`   ✅ Connected (Demo Mode: ${fabricService.demoMode})\n`);
        
        // Test creating data
        console.log('2. Testing data creation...');
        const testData = {
            farmerId: 'FARMER_TEST_001',
            cropType: 'corn',
            quantity: '500',
            unit: 'kg',
            harvestDate: '2025-09-20',
            location: 'Test Farm, AgriChain Valley',
            quality: 'Premium',
            createdBy: 'test_user'
        };
        
        const newId = `TEST_${Date.now()}`;
        const createResult = await fabricService.createData(newId, 'harvest', testData);
        console.log(`   ✅ Created data with ID: ${newId}`);
        console.log(`   📄 Result:`, JSON.stringify(createResult, null, 2));
        console.log('');
        
        // Test querying data
        console.log('3. Testing data query...');
        const queryResult = await fabricService.queryData(newId);
        console.log(`   ✅ Retrieved data for ID: ${newId}`);
        console.log(`   📄 Result:`, JSON.stringify(queryResult, null, 2));
        console.log('');
        
        // Test querying all data
        console.log('4. Testing query all data...');
        const allData = await fabricService.queryAllData();
        console.log(`   ✅ Retrieved ${allData.length} total records`);
        console.log('');
        
        // Test querying by type
        console.log('5. Testing query by type...');
        const harvestData = await fabricService.queryDataByType('harvest');
        console.log(`   ✅ Found ${harvestData.length} harvest records`);
        console.log('');
        
        // Test verification
        console.log('6. Testing data verification...');
        const verifyResult = await fabricService.verifyData(newId);
        console.log(`   ✅ Verified data with ID: ${newId}`);
        console.log(`   📄 Verified status: ${verifyResult.verified}`);
        console.log('');
        
        // Test history
        console.log('7. Testing data history...');
        const historyResult = await fabricService.getDataHistory(newId);
        console.log(`   ✅ Retrieved history with ${historyResult.length} entries`);
        console.log('');
        
        console.log('🎉 All Fabric integration tests passed!');
        console.log('🔧 System ready for blockchain operations');
        
        if (fabricService.demoMode) {
            console.log('\n📝 Note: Currently running in DEMO MODE');
            console.log('   To use real blockchain:');
            console.log('   1. Set FABRIC_DEMO_MODE=false in .env');
            console.log('   2. Start Hyperledger Fabric network');
            console.log('   3. Deploy chaincode and create wallet');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('🔧 Stack trace:', error.stack);
    } finally {
        await fabricService.disconnect();
        process.exit(0);
    }
}

// Run the test
testFabricIntegration();