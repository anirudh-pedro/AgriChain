const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  const atlasUri = process.env.MONGODB_ATLAS_URI;
  
  console.log('🔗 Testing MongoDB Atlas connection...');
  console.log('🔗 URI:', atlasUri?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials
  
  try {
    await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📍 Database:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
}

testConnection();