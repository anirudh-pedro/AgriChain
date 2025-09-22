const User = require('../models/User');
const Transaction = require('../models/Transaction');
const BatchUpload = require('../models/BatchUpload');
const Produce = require('../models/Produce');
const Purchase = require('../models/Purchase');
const authService = require('../middleware/auth');
const blockchainService = require('../services/blockchain');
const FabricService = require('../services/fabricService');
const traceabilityResolvers = require('./traceabilityResolvers');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { createReadStream } = require('fs');

// Initialize Fabric service
const fabricService = new FabricService();

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

    // Validate token
    validateToken: async (parent, args, { user }) => {
      if (!user) {
        return { valid: false };
      }
      try {
        const validUser = await authService.requireAuth(user);
        return { 
          valid: true, 
          user: {
            id: validUser.id,
            username: validUser.username,
            email: validUser.email,
            role: validUser.role,
            name: validUser.name,
            organization: validUser.organization,
            location: validUser.location,
            phone: validUser.phone,
            // Include role-specific fields
            aadhaarId: validUser.aadhaarId,
            landLocation: validUser.landLocation,
            typeOfProduce: validUser.typeOfProduce,
            gstin: validUser.gstin,
            businessName: validUser.businessName,
            contactPerson: validUser.contactPerson,
            businessAddress: validUser.businessAddress,
            licenseNumber: validUser.licenseNumber
          }
        };
      } catch (error) {
        return { valid: false };
      }
    },

    // Validate password reset token
    validateResetToken: async (parent, { token }) => {
      try {
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
          return {
            valid: false,
            message: 'Invalid or expired reset token'
          };
        }

        return {
          valid: true,
          message: 'Token is valid'
        };
      } catch (error) {
        console.error('Token validation error:', error);
        return {
          valid: false,
          message: 'Error validating token'
        };
      }
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
    },

    // === Fabric Blockchain Queries ===
    
    // Query blockchain data by ID
    blockchainData: async (parent, { id }, { user }) => {
      authService.requireAuth(user);

      try {
        if (!fabricService.isConnected) {
          await fabricService.connect();
        }

        const result = await fabricService.queryData(id);
        return result;

      } catch (error) {
        console.error('Blockchain query error:', error);
        
        // Fallback to MongoDB
        const transaction = await Transaction.findOne({ transactionId: id });
        if (transaction) {
          return transaction.data;
        }
        
        throw new Error(`Data not found: ${error.message}`);
      }
    },

    // Query all blockchain data
    allBlockchainData: async (parent, args, { user }) => {
      authService.requireAuth(user);

      try {
        if (!fabricService.isConnected) {
          await fabricService.connect();
        }

        const result = await fabricService.queryAllData();
        return result;

      } catch (error) {
        console.error('Blockchain query all error:', error);
        
        // Fallback to MongoDB
        const transactions = await Transaction.find({ status: 'committed' })
          .populate('userId', 'username email')
          .sort({ createdAt: -1 })
          .limit(50);
        
        return transactions.map(t => ({
          Key: t.transactionId,
          Record: t.data
        }));
      }
    },

    // Query blockchain data by type
    blockchainDataByType: async (parent, { type }, { user }) => {
      authService.requireAuth(user);

      try {
        if (!fabricService.isConnected) {
          await fabricService.connect();
        }

        const result = await fabricService.queryDataByType(type);
        return result;

      } catch (error) {
        console.error('Blockchain query by type error:', error);
        
        // Fallback to MongoDB
        const transactions = await Transaction.find({ 
          type: type,
          status: 'committed' 
        })
        .populate('userId', 'username email')
        .sort({ createdAt: -1 });
        
        return transactions.map(t => ({
          Key: t.transactionId,
          Record: t.data
        }));
      }
    },

    // Get data history from blockchain
    blockchainDataHistory: async (parent, { id }, { user }) => {
      authService.requireRole(user, ['admin', 'auditor']);

      try {
        if (!fabricService.isConnected) {
          await fabricService.connect();
        }

        const result = await fabricService.getDataHistory(id);
        return result;

      } catch (error) {
        console.error('Blockchain history error:', error);
        throw new Error(`History not available: ${error.message}`);
      }
    },

    // === Produce Queries ===
    produce: async (parent, { filter = {}, limit = 20, offset = 0 }, { user }) => {
      authService.requireAuth(user);
      
      const query = { status: 'AVAILABLE' };
      
      if (filter.cropName) {
        query.cropName = { $regex: filter.cropName, $options: 'i' };
      }
      
      if (filter.farmer) {
        query.farmer = filter.farmer;
      }
      
      if (filter.priceMin !== undefined || filter.priceMax !== undefined) {
        query.price = {};
        if (filter.priceMin !== undefined) query.price.$gte = filter.priceMin;
        if (filter.priceMax !== undefined) query.price.$lte = filter.priceMax;
      }
      
      if (filter.quality) {
        query.quality = filter.quality;
      }
      
      if (filter.organic !== undefined) {
        query.organic = filter.organic;
      }
      
      if (filter.status) {
        query.status = filter.status;
      }
      
      if (filter.search) {
        query.$or = [
          { cropName: { $regex: filter.search, $options: 'i' } },
          { farmLocation: { $regex: filter.search, $options: 'i' } },
          { description: { $regex: filter.search, $options: 'i' } }
        ];
      }
      
      return await Produce.find(query)
        .populate('farmer', 'name username email location')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
    },

    produceById: async (parent, { id }, { user }) => {
      authService.requireAuth(user);
      
      const produce = await Produce.findById(id).populate('farmer', 'name username email location');
      if (!produce) {
        throw new Error('Produce not found');
      }
      
      return produce;
    },

    myProduce: async (parent, { status }, { user }) => {
      authService.requireAuth(user);
      
      const query = { farmer: user.id };
      if (status) {
        query.status = status;
      }
      
      return await Produce.find(query)
        .populate('farmer', 'name username email location')
        .sort({ createdAt: -1 });
    },

    // === Purchase Queries ===
    purchases: async (parent, { limit = 20, offset = 0 }, { user }) => {
      authService.requireRole(user, ['admin']);
      
      return await Purchase.find()
        .populate('produce')
        .populate('buyer', 'name username email')
        .populate('seller', 'name username email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
    },

    myPurchases: async (parent, args, { user }) => {
      authService.requireAuth(user);
      
      return await Purchase.find({ buyer: user.id })
        .populate('produce')
        .populate('seller', 'name username email')
        .sort({ createdAt: -1 });
    },

    mySales: async (parent, args, { user }) => {
      authService.requireAuth(user);
      
      return await Purchase.find({ seller: user.id })
        .populate('produce')
        .populate('buyer', 'name username email')
        .sort({ createdAt: -1 });
    },

    // === Dashboard Queries ===
    dashboardStats: async (parent, args, { user }) => {
      authService.requireAuth(user);
      
      const stats = {};
      
      if (user.role === 'farmer') {
        const myProduce = await Produce.find({ farmer: user.id });
        const mySales = await Purchase.find({ seller: user.id });
        
        stats.totalProduce = myProduce.length;
        stats.availableProduce = myProduce.filter(p => p.status === 'AVAILABLE').length;
        stats.soldProduce = myProduce.filter(p => p.status === 'SOLD').length;
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        const thisMonthSales = mySales.filter(s => s.purchaseDate >= thisMonth);
        stats.thisMonthEarnings = thisMonthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        
        const allEarnings = mySales.filter(s => s.status === 'DELIVERED');
        stats.totalEarnings = allEarnings.reduce((sum, sale) => sum + sale.totalAmount, 0);
        
        const pendingSales = mySales.filter(s => ['PROCESSING', 'CONFIRMED', 'IN_TRANSIT'].includes(s.status));
        stats.pendingPayments = pendingSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        
      } else if (['distributor', 'retailer', 'consumer'].includes(user.role)) {
        const myPurchases = await Purchase.find({ buyer: user.id });
        
        stats.activePurchases = myPurchases.filter(p => ['PROCESSING', 'CONFIRMED', 'IN_TRANSIT'].includes(p.status)).length;
        stats.totalPurchases = myPurchases.length;
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        const thisMonthPurchases = myPurchases.filter(p => p.purchaseDate >= thisMonth);
        stats.thisMonthSpent = thisMonthPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
        
      } else if (user.role === 'admin') {
        const totalUsers = await User.countDocuments();
        const totalProduce = await Produce.countDocuments();
        const totalPurchases = await Purchase.countDocuments();
        
        stats.totalUsers = totalUsers;
        stats.totalProduce = totalProduce;
        stats.totalPurchases = totalPurchases;
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        const thisMonthTransactions = await Purchase.find({ 
          purchaseDate: { $gte: thisMonth } 
        });
        stats.thisMonthEarnings = thisMonthTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
      }
      
      return stats;
    }
  },

  // Mutations
  Mutation: {
    // User registration
    register: async (parent, { input }) => {
      const { 
        username, email, password, role, name, organization, location, phone,
        // Farmer-specific fields
        aadhaarId, landLocation, typeOfProduce,
        // Distributor/Retailer-specific fields
        gstin, businessName, contactPerson, businessAddress, licenseNumber
      } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email or username already exists'
        };
      }

      // Create new user with role-specific fields
      const userData = { 
        username, 
        email, 
        password, 
        role: role || 'consumer',
        name,
        organization,
        location,
        phone
      };

      // Add role-specific fields
      if (role === 'farmer') {
        if (aadhaarId) userData.aadhaarId = aadhaarId;
        if (landLocation) userData.landLocation = landLocation;
        if (typeOfProduce) userData.typeOfProduce = typeOfProduce;
      } else if (role === 'distributor' || role === 'retailer') {
        if (gstin) userData.gstin = gstin;
        if (businessName) userData.businessName = businessName;
        if (contactPerson) userData.contactPerson = contactPerson;
        if (businessAddress) userData.businessAddress = businessAddress;
        if (licenseNumber) userData.licenseNumber = licenseNumber;
      }

      const user = new User(userData);
      await user.save();

      // Register user in blockchain wallet
      try {
        await blockchainService.registerUser(user.id);
      } catch (error) {
        console.warn('Failed to register user in blockchain wallet:', error.message);
      }

      // Generate token
      const token = authService.generateToken(user.id);

      return { 
        success: true,
        message: 'Registration successful',
        token, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name,
          organization: user.organization,
          location: user.location,
          phone: user.phone,
          // Include role-specific fields in response
          aadhaarId: user.aadhaarId,
          landLocation: user.landLocation,
          typeOfProduce: user.typeOfProduce,
          gstin: user.gstin,
          businessName: user.businessName,
          contactPerson: user.contactPerson,
          businessAddress: user.businessAddress,
          licenseNumber: user.licenseNumber
        }
      };
    },

    // User login
    login: async (parent, { input }) => {
      const { email, password } = input;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is deactivated'
        };
      }

      // Generate token
      const token = authService.generateToken(user.id);

      return { 
        success: true,
        message: 'Login successful',
        token, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name,
          organization: user.organization,
          location: user.location,
          phone: user.phone,
          // Include role-specific fields
          aadhaarId: user.aadhaarId,
          landLocation: user.landLocation,
          typeOfProduce: user.typeOfProduce,
          gstin: user.gstin,
          businessName: user.businessName,
          contactPerson: user.contactPerson,
          businessAddress: user.businessAddress,
          licenseNumber: user.licenseNumber
        }
      };
    },

    // Update user profile
    updateProfile: async (parent, { input }, { user }) => {
      try {
        const currentUser = await authService.requireAuth(user);
        
        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
          currentUser.id,
          { $set: input },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return {
            success: false,
            message: 'User not found'
          };
        }

        return {
          success: true,
          message: 'Profile updated successfully',
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            organization: updatedUser.organization,
            location: updatedUser.location,
            phone: updatedUser.phone,
            // Include role-specific fields
            aadhaarId: updatedUser.aadhaarId,
            landLocation: updatedUser.landLocation,
            typeOfProduce: updatedUser.typeOfProduce,
            gstin: updatedUser.gstin,
            businessName: updatedUser.businessName,
            contactPerson: updatedUser.contactPerson,
            businessAddress: updatedUser.businessAddress,
            licenseNumber: updatedUser.licenseNumber
          }
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Failed to update profile'
        };
      }
    },

    // Forgot Password
    forgotPassword: async (parent, { email }) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
          // Don't reveal if email exists or not for security
          return {
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
          };
        }

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Set token and expiration (1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // In a real application, you would send an email here
        // For now, we'll log the reset URL
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
        console.log(`Password reset URL for ${email}: ${resetUrl}`);

        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      } catch (error) {
        console.error('Forgot password error:', error);
        return {
          success: false,
          message: 'An error occurred while processing your request.'
        };
      }
    },

    // Reset Password
    resetPassword: async (parent, { input }) => {
      try {
        const { token, password } = input;

        // Find user with valid reset token
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
          return {
            success: false,
            message: 'Invalid or expired reset token'
          };
        }

        // Update password and clear reset token
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return {
          success: true,
          message: 'Password has been reset successfully'
        };
      } catch (error) {
        console.error('Reset password error:', error);
        return {
          success: false,
          message: 'An error occurred while resetting your password.'
        };
      }
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
    },

    // === Produce Mutations ===
    addProduce: async (parent, { input }, { user }) => {
      authService.requireRole(user, ['farmer']);
      
      const produce = new Produce({
        ...input,
        farmer: user.id
      });
      
      // Initialize the journey
      await produce.save();
      await produce.initializeJourney();
      
      // Optionally create blockchain entry
      try {
        if (fabricService.isConnected) {
          const blockchainData = await fabricService.createData({
            type: 'PRODUCE_REGISTRATION',
            farmerId: user.id,
            cropType: input.cropName,
            quantity: input.quantity,
            location: input.farmLocation,
            quality: input.quality,
            customData: JSON.stringify({
              harvestDate: input.harvestDate,
              price: input.price,
              organic: input.organic
            })
          });
          
          produce.blockchainId = blockchainData.id;
          await produce.save();
        }
      } catch (error) {
        console.error('Blockchain entry failed for produce:', error);
        // Continue without blockchain - produce is still saved
      }
      
      return await Produce.findById(produce._id).populate('farmer', 'name username email location');
    },

    updateProduce: async (parent, { id, input }, { user }) => {
      authService.requireAuth(user);
      
      const produce = await Produce.findById(id);
      if (!produce) {
        throw new Error('Produce not found');
      }
      
      // Check ownership
      if (produce.farmer.toString() !== user.id && user.role !== 'admin') {
        throw new Error('Not authorized to update this produce');
      }
      
      Object.assign(produce, input);
      await produce.save();
      
      return await Produce.findById(id).populate('farmer', 'name username email location');
    },

    deleteProduce: async (parent, { id }, { user }) => {
      authService.requireAuth(user);
      
      const produce = await Produce.findById(id);
      if (!produce) {
        throw new Error('Produce not found');
      }
      
      // Check ownership
      if (produce.farmer.toString() !== user.id && user.role !== 'admin') {
        throw new Error('Not authorized to delete this produce');
      }
      
      // Can only delete if not sold
      if (produce.status !== 'AVAILABLE') {
        throw new Error('Cannot delete produce that has been sold');
      }
      
      await Produce.findByIdAndDelete(id);
      return true;
    },

    updateProduceStatus: async (parent, { id, status }, { user }) => {
      authService.requireAuth(user);
      
      const produce = await Produce.findById(id);
      if (!produce) {
        throw new Error('Produce not found');
      }
      
      // Check authorization based on status change
      if (user.role !== 'admin' && produce.farmer.toString() !== user.id) {
        throw new Error('Not authorized to update this produce status');
      }
      
      produce.status = status;
      await produce.save();
      
      return await Produce.findById(id).populate('farmer', 'name username email location');
    },

    // === Purchase Mutations ===
    createPurchase: async (parent, { input }, { user }) => {
      authService.requireAuth(user);
      
      const produce = await Produce.findById(input.produceId).populate('farmer');
      if (!produce) {
        throw new Error('Produce not found');
      }
      
      if (produce.status !== 'AVAILABLE') {
        throw new Error('Produce is not available for purchase');
      }
      
      // Can't buy from yourself
      if (produce.farmer._id.toString() === user.id) {
        throw new Error('Cannot purchase your own produce');
      }
      
      // Calculate total amount based on quantity and price
      const quantityNum = parseFloat(input.quantity.replace(/[^\d.]/g, ''));
      const totalAmount = quantityNum * produce.price;
      
      const purchase = new Purchase({
        produce: input.produceId,
        buyer: user.id,
        seller: produce.farmer._id,
        quantity: input.quantity,
        totalAmount,
        deliveryAddress: input.deliveryAddress,
        notes: input.notes
      });
      
      await purchase.save();
      await purchase.calculateDeliveryDate();
      
      // Update produce status
      produce.status = 'SOLD';
      await produce.save();
      
      // Update produce journey
      await produce.updateJourney('Distributor', user.organization || 'Distribution Center');
      
      // Create blockchain transaction
      try {
        if (fabricService.isConnected) {
          await fabricService.createData({
            type: 'PURCHASE_TRANSACTION',
            customData: JSON.stringify({
              purchaseId: purchase._id,
              produceId: produce._id,
              buyerId: user.id,
              sellerId: produce.farmer._id,
              amount: totalAmount,
              quantity: input.quantity
            })
          });
        }
      } catch (error) {
        console.error('Blockchain transaction recording failed:', error);
        // Continue - purchase is still valid
      }
      
      return await Purchase.findById(purchase._id)
        .populate('produce')
        .populate('buyer', 'name username email')
        .populate('seller', 'name username email');
    },

    updatePurchaseStatus: async (parent, { id, status }, { user }) => {
      authService.requireAuth(user);
      
      const purchase = await Purchase.findById(id);
      if (!purchase) {
        throw new Error('Purchase not found');
      }
      
      // Check authorization
      const isAuthorized = purchase.buyer.toString() === user.id || 
                          purchase.seller.toString() === user.id ||
                          user.role === 'admin';
                          
      if (!isAuthorized) {
        throw new Error('Not authorized to update this purchase');
      }
      
      await purchase.updateStatus(status);
      
      return await Purchase.findById(id)
        .populate('produce')
        .populate('buyer', 'name username email')
        .populate('seller', 'name username email');
    },

    ratePurchase: async (parent, { id, rating, review }, { user }) => {
      authService.requireAuth(user);
      
      const purchase = await Purchase.findById(id);
      if (!purchase) {
        throw new Error('Purchase not found');
      }
      
      // Only buyer can rate
      if (purchase.buyer.toString() !== user.id) {
        throw new Error('Only the buyer can rate this purchase');
      }
      
      // Can only rate delivered purchases
      if (purchase.status !== 'DELIVERED') {
        throw new Error('Can only rate delivered purchases');
      }
      
      purchase.rating = rating;
      if (review) purchase.review = review;
      await purchase.save();
      
      return await Purchase.findById(id)
        .populate('produce')
        .populate('buyer', 'name username email')
        .populate('seller', 'name username email');
    },

    // === Fabric Blockchain Operations ===
    
    // Create blockchain data entry
    createBlockchainData: async (parent, { input }, { user }) => {
      authService.requireAuth(user);

      try {
        // Connect to Fabric if not already connected
        if (!fabricService.isConnected) {
          await fabricService.connect();
        }

        // Create unique ID
        const id = `DATA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Add user context to data
        const dataWithContext = {
          ...input,
          createdBy: user.id,
          createdByEmail: user.email,
          organizationId: user.organizationId || 'ORG001'
        };

        // Submit to blockchain
        const blockchainResult = await fabricService.createData(id, input.type, dataWithContext);
        
        // Also save to MongoDB for faster queries
        const transaction = new Transaction({
          transactionId: id,
          type: input.type,
          data: dataWithContext,
          userId: user.id,
          blockchainTxId: blockchainResult.id || id,
          status: 'committed',
          metadata: {
            fabricTimestamp: blockchainResult.timestamp,
            verified: blockchainResult.verified || false
          }
        });

        await transaction.save();

        return {
          id: id,
          success: true,
          blockchainTxId: id,
          message: 'Data successfully recorded on blockchain',
          data: blockchainResult
        };

      } catch (error) {
        console.error('Blockchain data creation error:', error);
        
        // Fallback to MongoDB only if blockchain fails
        const transaction = new Transaction({
          transactionId: `OFFLINE_${Date.now()}`,
          type: input.type,
          data: input,
          userId: user.id,
          status: 'pending_blockchain',
          metadata: {
            error: error.message,
            fallbackMode: true
          }
        });

        await transaction.save();

        return {
          id: transaction.transactionId,
          success: false,
          message: `Blockchain unavailable. Data saved locally: ${error.message}`,
          data: transaction
        };
      }
    },

    // Verify blockchain data (Admin/Auditor only)
    verifyBlockchainData: async (parent, { dataId }, { user }) => {
      authService.requireRole(user, ['admin', 'auditor']);

      try {
        if (!fabricService.isConnected) {
          await fabricService.connect();
        }

        const result = await fabricService.verifyData(dataId);
        
        // Update MongoDB record
        await Transaction.findOneAndUpdate(
          { transactionId: dataId },
          { 
            'metadata.verified': true,
            'metadata.verifiedBy': user.id,
            'metadata.verifiedAt': new Date()
          }
        );

        return {
          id: dataId,
          success: true,
          message: 'Data successfully verified on blockchain',
          data: result
        };

      } catch (error) {
        console.error('Blockchain verification error:', error);
        return {
          id: dataId,
          success: false,
          message: `Verification failed: ${error.message}`
        };
      }
    }
  }
};

// Merge traceability resolvers
const mergedResolvers = {
  Query: {
    ...resolvers.Query,
    ...traceabilityResolvers.Query
  },
  Mutation: {
    ...resolvers.Mutation,
    ...traceabilityResolvers.Mutation
  }
};

module.exports = mergedResolvers;