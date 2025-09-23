const axios = require('axios');

async function addBlockchainData() {
    console.log('🎯 Adding sample data to AgriChain blockchain...\n');

    const API_URL = 'http://localhost:4000/graphql';
    
    // Sample blockchain data
    const blockchainData = {
        type: 'harvest',
        farmerId: 'JUDGE_DEMO_FARMER',
        cropType: 'Premium Basmati Rice',
        quantity: '1000',
        unit: 'kg',
        location: 'Punjab, India - Demo Farm',
        quality: 'Grade A+',
        customData: JSON.stringify({
            harvestDate: '2025-09-22',
            organicCertified: true,
            soilQuality: 'Excellent',
            weatherConditions: 'Optimal'
        })
    };

    const mutation = `
        mutation CreateBlockchainData($input: BlockchainDataInput!) {
            createBlockchainData(input: $input) {
                id
                success
                blockchainTxId
                message
                data {
                    id
                    type
                    timestamp
                    verified
                }
            }
        }
    `;

    try {
        console.log('📝 Creating blockchain transaction...');
        console.log('Data:', JSON.stringify(blockchainData, null, 2));
        console.log();

        const response = await axios.post(API_URL, {
            query: mutation,
            variables: { input: blockchainData }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.data) {
            const result = response.data.data.createBlockchainData;
            console.log('✅ BLOCKCHAIN TRANSACTION SUCCESSFUL!');
            console.log('📋 Transaction Details:');
            console.log(`   🆔 ID: ${result.id}`);
            console.log(`   🔗 Blockchain TX ID: ${result.blockchainTxId}`);
            console.log(`   ✅ Success: ${result.success}`);
            console.log(`   📄 Message: ${result.message}`);
            console.log(`   ⏰ Timestamp: ${result.data.timestamp}`);
            console.log(`   🔒 Verified: ${result.data.verified}`);
        } else {
            console.log('❌ Error:', response.data.errors);
        }

    } catch (error) {
        console.error('❌ Failed to connect to backend:', error.message);
        console.log('\n🔧 Make sure your backend is running on http://localhost:4000');
    }

    console.log('\n🎬 Ready for judge demonstration!');
    console.log('📱 Open frontend: http://localhost:5173');
    console.log('🔧 Open GraphQL: http://localhost:4000/graphql');
}

addBlockchainData();