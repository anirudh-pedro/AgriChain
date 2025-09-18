const User = require('../models/User');
const Transaction = require('../models/Transaction');
const BatchUpload = require('../models/BatchUpload');
const authService = require('../middleware/auth');
const blockchainService = require('../services/blockchain');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { createReadStream } = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'));
    }
  }
});

const resolvers = {
  // Queries
  Query: {
    // Get current user
    me: async (parent, args, { user }) => {
      return authService.requireAuth(user);
    },

    // Get transactions with filtering
    transactions: async (parent, { filter = {}, limit = 10, offset = 0 }, { user }) => {
      authService.requireAuth(user);

      const query = {};
      
      // Apply filters
      if (filter.status) query.status = filter.status;
      if (filter.submittedBy) query.submittedBy = filter.submittedBy;
      if (filter.fromDate || filter.toDate) {
        query.createdAt = {};
        if (filter.fromDate) query.createdAt.$gte = new Date(filter.fromDate);
        if (filter.toDate) query.createdAt.$lte = new Date(filter.toDate);
      }
      if (filter.search) {
        query.$or = [
          { transactionId: { $regex: filter.search, $options: 'i' } },
          { data: { $regex: filter.search, $options: 'i' } }
        ];
      }

      return await Transaction.find(query)
        .populate('submittedBy')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
    },

    // Get single transaction
    transaction: async (parent, { id }, { user }) => {
      authService.requireAuth(user);
      return await Transaction.findById(id).populate('submittedBy');
    },

    // Get transaction by hash
    transactionByHash: async (parent, { hash }, { user }) => {
      authService.requireAuth(user);
      return await Transaction.findOne({ hash }).populate('submittedBy');
    },

    // Get batch uploads
    batchUploads: async (parent, { limit = 10, offset = 0 }, { user }) => {
      authService.requireAuth(user);
      
      const query = user.role === 'ADMIN' ? {} : { uploadedBy: user.id };
      
      return await BatchUpload.find(query)
        .populate('uploadedBy')
        .populate('successfulTransactions')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
    },

    // Get single batch upload
    batchUpload: async (parent, { id }, { user }) => {
      authService.requireAuth(user);
      
      const query = user.role === 'ADMIN' ? { _id: id } : { _id: id, uploadedBy: user.id };
      
      return await BatchUpload.findOne(query)
        .populate('uploadedBy')
        .populate('successfulTransactions');
    },

    // Get transaction statistics
    transactionStats: async (parent, args, { user }) => {
      authService.requireAuth(user);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [total, pending, confirmed, failed, todayCount, weekCount, monthCount] = await Promise.all([
        Transaction.countDocuments(),
        Transaction.countDocuments({ status: 'PENDING' }),
        Transaction.countDocuments({ status: 'CONFIRMED' }),
        Transaction.countDocuments({ status: 'FAILED' }),
        Transaction.countDocuments({ createdAt: { $gte: today } }),
        Transaction.countDocuments({ createdAt: { $gte: thisWeek } }),
        Transaction.countDocuments({ createdAt: { $gte: thisMonth } })
      ]);

      return {
        totalTransactions: total,
        pendingTransactions: pending,
        confirmedTransactions: confirmed,
        failedTransactions: failed,
        transactionsToday: todayCount,
        transactionsThisWeek: weekCount,
        transactionsThisMonth: monthCount
      };
    },

    // Get user statistics (Admin only)
    userStats: async (parent, args, { user }) => {
      authService.requireAdmin(user);

      const [total, active, roleStats] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } },
          { $project: { role: '$_id', count: 1, _id: 0 } }
        ])
      ]);

      return {
        totalUsers: total,
        activeUsers: active,
        usersByRole: roleStats
      };
    },

    // Get all users (Admin only)
    users: async (parent, { limit = 10, offset = 0 }, { user }) => {
      authService.requireAdmin(user);
      
      return await User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
    }
  },

  // Mutations
  Mutation: {
    // User registration
    register: async (parent, { input }) => {
      const { username, email, password, role } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Create new user
      const user = new User({ username, email, password, role });
      await user.save();

      // Register user in blockchain wallet
      try {
        await blockchainService.registerUser(user.id);
      } catch (error) {
        console.warn('Failed to register user in blockchain wallet:', error.message);
      }

      // Generate token
      const token = authService.generateToken(user.id);

      return { token, user };
    },

    // User login
    login: async (parent, { input }) => {
      const { email, password } = input;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Generate token
      const token = authService.generateToken(user.id);

      return { token, user };
    },

    // Submit single transaction
    submitTransaction: async (parent, { input }, { user }) => {
      authService.requireAuth(user);

      const { data, type = 'generic', metadata } = input;

      try {
        // Submit to blockchain
        const blockchainResult = await blockchainService.submitTransaction(data, user.id);

        // Create transaction record in MongoDB
        const transaction = new Transaction({
          transactionId: blockchainResult.transactionId,
          data,
          hash: blockchainResult.hash,
          submittedBy: user.id,
          status: 'CONFIRMED',
          validated: true,
          type,
          metadata,
          fabricTxId: blockchainResult.fabricTxId
        });

        await transaction.save();
        await transaction.populate('submittedBy');

        return transaction;
      } catch (error) {
        // Create failed transaction record
        const transaction = new Transaction({
          transactionId: `failed_${Date.now()}`,
          data,
          hash: blockchainService.createHash(data),
          submittedBy: user.id,
          status: 'FAILED',
          validated: false,
          type,
          metadata,
          errorMessage: error.message
        });

        await transaction.save();
        await transaction.populate('submittedBy');

        return transaction;
      }
    },

    // Update user role (Admin only)
    updateUserRole: async (parent, { userId, role }, { user }) => {
      authService.requireAdmin(user);

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      targetUser.role = role;
      await targetUser.save();

      return targetUser;
    },

    // Delete user (Admin only)
    deleteUser: async (parent, { userId }, { user }) => {
      authService.requireAdmin(user);

      if (userId === user.id) {
        throw new Error('Cannot delete your own account');
      }

      const deletedUser = await User.findByIdAndDelete(userId);
      return !!deletedUser;
    }
  }
};

module.exports = resolvers;