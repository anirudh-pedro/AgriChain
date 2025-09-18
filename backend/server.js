const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import services
const databaseService = require('./src/services/database');

// Import GraphQL schema and resolvers
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');

// Import middleware
const authMiddleware = require('./src/middleware/auth');

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Database connection
  try {
    await databaseService.connect();
    if (databaseService.isHealthy()) {
      await databaseService.createIndexes();
    }
  } catch (error) {
    console.warn('⚠️ Database connection failed, but server will continue:', error.message);
    console.log('🔧 Server will run without database for development purposes');
  }

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add authentication context
      const token = req.headers.authorization || '';
      return { token, user: authMiddleware.getUser(token) };
    },
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
  });

  await server.start();

  // Apply Apollo GraphQL middleware
  server.applyMiddleware({ app, path: '/graphql' });

  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      const dbStats = await databaseService.getStats();
      res.json({ 
        status: 'ok', 
        message: 'AgriChain Backend Server is running',
        database: dbStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Health check failed',
        error: error.message
      });
    }
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await databaseService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await databaseService.disconnect();
  process.exit(0);
});

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});