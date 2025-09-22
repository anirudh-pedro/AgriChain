// API Service for Hyperledger Fabric Backend Integration
import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const BLOCKCHAIN_API_URL = import.meta.env.VITE_BLOCKCHAIN_API_URL || 'http://localhost:4000/api/blockchain';

// Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for blockchain operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== BLOCKCHAIN SERVICE =====
export const blockchainService = {
  // Verify blockchain transaction
  verifyTransaction: async (transactionHash) => {
    try {
      const response = await api.get(`/api/blockchain/verify/${transactionHash}`);
      return {
        success: true,
        data: response.data,
        isValid: response.data.isValid,
        blockNumber: response.data.blockNumber,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Verification failed'
      };
    }
  },

  // Get transaction details from blockchain
  getTransactionDetails: async (transactionId) => {
    try {
      const response = await api.get(`/api/blockchain/transaction/${transactionId}`);
      return {
        success: true,
        data: response.data,
        hash: response.data.transactionHash,
        status: response.data.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transaction'
      };
    }
  },

  // Query world state (CouchDB)
  queryWorldState: async (queryString) => {
    try {
      const response = await api.post('/api/blockchain/query', {
        query: queryString
      });
      return {
        success: true,
        data: response.data.results,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Query failed'
      };
    }
  }
};

// ===== PRODUCE SERVICE =====
export const produceService = {
  // Get all available produce with filters
  getAllProduce: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.cropType) params.append('cropType', filters.cropType);
      if (filters.location) params.append('location', filters.location);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.farmerId) params.append('farmerId', filters.farmerId);
      if (filters.availableOnly) params.append('availableOnly', 'true');
      
      const response = await api.get(`/api/produce?${params.toString()}`);
      return {
        success: true,
        data: response.data.produce,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch produce'
      };
    }
  },

  // Get produce by ID
  getProduceById: async (produceId) => {
    try {
      const response = await api.get(`/api/produce/${produceId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Produce not found'
      };
    }
  },

  // Add new produce (Farmer only)
  addProduce: async (produceData) => {
    try {
      const response = await api.post('/api/produce', {
        cropName: produceData.cropName,
        quantity: produceData.quantity,
        price: produceData.price,
        harvestDate: produceData.harvestDate,
        location: {
          latitude: produceData.location.lat,
          longitude: produceData.location.lng,
          address: produceData.location.address
        },
        description: produceData.description,
        organicCertified: produceData.organicCertified,
        images: produceData.images
      });

      return {
        success: true,
        data: response.data,
        produceId: response.data.produceId,
        qrCode: response.data.qrCode,
        transactionHash: response.data.transactionHash
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add produce'
      };
    }
  },

  // Update produce availability
  updateProduceAvailability: async (produceId, newQuantity) => {
    try {
      const response = await api.patch(`/api/produce/${produceId}/availability`, {
        quantity: newQuantity
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update availability'
      };
    }
  },

  // Get produce traceability
  getProduceTrace: async (produceId) => {
    try {
      const response = await api.get(`/api/produce/${produceId}/trace`);
      return {
        success: true,
        data: response.data,
        journey: response.data.supplyChainJourney,
        currentOwner: response.data.currentOwner,
        status: response.data.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Traceability data not found'
      };
    }
  }
};

// ===== TRANSACTION SERVICE =====
export const transactionService = {
  // Get user's transaction history
  getTransactionHistory: async (userId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/api/transactions?userId=${userId}&${params.toString()}`);
      return {
        success: true,
        data: response.data.transactions,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transactions'
      };
    }
  },

  // Create new transaction (Purchase/Sale)
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/api/transactions', {
        produceId: transactionData.produceId,
        buyerId: transactionData.buyerId,
        sellerId: transactionData.sellerId,
        quantity: transactionData.quantity,
        pricePerUnit: transactionData.pricePerUnit,
        totalAmount: transactionData.totalAmount,
        transactionType: transactionData.type, // 'purchase', 'sale', 'transfer'
        paymentMethod: transactionData.paymentMethod,
        deliveryLocation: transactionData.deliveryLocation,
        expectedDeliveryDate: transactionData.expectedDeliveryDate
      });

      return {
        success: true,
        data: response.data,
        transactionId: response.data.transactionId,
        transactionHash: response.data.transactionHash,
        status: response.data.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Transaction failed'
      };
    }
  },

  // Update transaction status
  updateTransactionStatus: async (transactionId, status, notes = '') => {
    try {
      const response = await api.patch(`/api/transactions/${transactionId}/status`, {
        status, // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
        notes
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update status'
      };
    }
  }
};

// ===== ANALYTICS SERVICE =====
export const analyticsService = {
  // Get farmer analytics
  getFarmerAnalytics: async (farmerId, timeRange = '30d') => {
    try {
      const response = await api.get(`/api/analytics/farmer/${farmerId}?range=${timeRange}`);
      return {
        success: true,
        data: response.data,
        earnings: response.data.totalEarnings,
        salesCount: response.data.totalSales,
        topCrops: response.data.topPerformingCrops,
        monthlyTrends: response.data.monthlyTrends
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  },

  // Get consumer analytics
  getConsumerAnalytics: async (consumerId, timeRange = '30d') => {
    try {
      const response = await api.get(`/api/analytics/consumer/${consumerId}?range=${timeRange}`);
      return {
        success: true,
        data: response.data,
        totalSpent: response.data.totalSpent,
        purchaseCount: response.data.totalPurchases,
        favoriteCategories: response.data.favoriteCategories,
        monthlySpending: response.data.monthlySpending
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  },

  // Get platform-wide analytics (Admin only)
  getPlatformAnalytics: async (timeRange = '30d') => {
    try {
      const response = await api.get(`/api/analytics/platform?range=${timeRange}`);
      return {
        success: true,
        data: response.data,
        totalUsers: response.data.totalUsers,
        totalTransactions: response.data.totalTransactions,
        platformRevenue: response.data.platformRevenue,
        growthMetrics: response.data.growthMetrics,
        userDistribution: response.data.userDistribution
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch platform analytics'
      };
    }
  }
};

// ===== USER SERVICE =====
export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/profile`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/api/users/${userId}/profile`, profileData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Get all users (Admin only)
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/api/users?${params.toString()}`);
      return {
        success: true,
        data: response.data.users,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  }
};

// ===== QR CODE SERVICE =====
export const qrCodeService = {
  // Generate QR code for produce
  generateProduceQR: async (produceId) => {
    try {
      const response = await api.post('/api/qr/generate', {
        type: 'produce',
        id: produceId
      });
      return {
        success: true,
        qrCodeData: response.data.qrCode,
        qrCodeUrl: response.data.qrCodeUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate QR code'
      };
    }
  },

  // Decode QR code data
  decodeQR: async (qrData) => {
    try {
      const response = await api.post('/api/qr/decode', {
        qrData
      });
      return {
        success: true,
        data: response.data,
        type: response.data.type,
        id: response.data.id
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid QR code'
      };
    }
  }
};

// ===== NOTIFICATION SERVICE =====
export const notificationService = {
  // Get user notifications
  getNotifications: async (userId) => {
    try {
      const response = await api.get(`/api/notifications?userId=${userId}`);
      return {
        success: true,
        data: response.data.notifications,
        unreadCount: response.data.unreadCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  }
};

// Export all services
export {
  api as default,
  blockchainService,
  produceService,
  transactionService,
  analyticsService,
  userService,
  qrCodeService,
  notificationService
};