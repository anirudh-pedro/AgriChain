const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  // Connect to MongoDB
  async connect() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrichain';
    const atlasUri = process.env.MONGODB_ATLAS_URI;
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout for Atlas
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    // Try connecting to Atlas first, then local
    const connections = [];
    
    // Add Atlas as primary option if available
    if (atlasUri) {
      connections.push({ uri: atlasUri, name: 'MongoDB Atlas' });
    }
    
    // Add local as backup
    connections.push({ uri: mongoUri, name: 'Local MongoDB' });

    let lastError = null;
    
    for (const connection of connections) {
      try {
        console.log(`🔄 Attempting to connect to: ${connection.name}`);
        
        await mongoose.connect(connection.uri, options);
        this.isConnected = true;
        
        console.log(`✅ Connected to ${connection.name}`);
        console.log(`📍 Database: ${mongoose.connection.name}`);
        
        // Setup connection event handlers
        this.setupConnectionHandlers();
        return; // Success, exit the function
        
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Failed to connect to ${connection.name}: ${error.message}`);
      }
    }

    // If we get here, all connections failed
    console.error('❌ All database connections failed. Starting server without database...');
    console.log('🔧 You can:');
    console.log('   1. Install and start MongoDB locally: mongod');
    console.log('   2. Update your Atlas credentials in .env file');
    console.log('   3. Check Atlas user permissions and IP whitelist');
    console.log('   4. The server will still start for development');
    
    if (lastError) {
      console.log('🐛 Last connection error:', lastError.message);
    }
    
    this.isConnected = false;
    // Don't throw error - let server start without database for development
  }

  setupConnectionHandlers() {
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      this.isConnected = true;
    });
  }

  // Disconnect from MongoDB
  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  // Check connection status
  isHealthy() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  // Get database statistics
  async getStats() {
    try {
      const User = require('../models/User');
      const Transaction = require('../models/Transaction');
      const BatchUpload = require('../models/BatchUpload');

      const [userCount, transactionCount, batchUploadCount] = await Promise.all([
        User.countDocuments(),
        Transaction.countDocuments(),
        BatchUpload.countDocuments()
      ]);

      return {
        collections: {
          users: userCount,
          transactions: transactionCount,
          batchUploads: batchUploadCount
        },
        connectionState: mongoose.connection.readyState,
        isHealthy: this.isHealthy()
      };
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      return {
        error: error.message,
        isHealthy: false
      };
    }
  }

  // Clear database (for development/testing only)
  async clearDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clear database in production environment');
    }

    try {
      await mongoose.connection.db.dropDatabase();
      console.log('✅ Database cleared');
    } catch (error) {
      console.error('❌ Error clearing database:', error);
      throw error;
    }
  }

  // Create indexes for better performance
  async createIndexes() {
    try {
      const User = require('../models/User');
      const Transaction = require('../models/Transaction');
      const BatchUpload = require('../models/BatchUpload');

      // User indexes
      await User.createIndexes();
      
      // Transaction indexes
      await Transaction.createIndexes();
      
      // BatchUpload indexes
      await BatchUpload.createIndexes();

      console.log('✅ Database indexes created');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
    }
  }
}

module.exports = new DatabaseService();