// Traceability and Analytics Resolvers
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Produce = require('../models/Produce');
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const traceabilityResolvers = {
  Query: {
    // Trace product by product ID or QR code
    traceProduct: async (_, { productId, qrCode }, { user }) => {
      try {
        // Find produce by ID
        const produce = await Produce.findOne({
          $or: [
            { _id: productId },
            { blockchainId: productId },
            { qrCode: qrCode }
          ]
        }).populate('farmer');

        if (!produce) {
          throw new UserInputError('Product not found');
        }

        // Mock journey data - in production, this would come from blockchain
        const mockJourney = [
          {
            id: '1',
            stage: 'Farming',
            title: 'Grown by Farmer',
            actor: produce.farmer.name || produce.farmer.username,
            location: produce.farmLocation,
            date: produce.harvestDate,
            time: '06:00 AM',
            description: `${produce.cropName} planted and grown using ${produce.organic ? 'organic' : 'conventional'} farming practices`,
            blockchainHash: `0x1a2b3c4d5e6f7890abcdef1234567890abcdef${produce._id.toString().slice(-2)}`,
            status: 'COMPLETED',
            details: {
              farmingMethod: produce.organic ? 'Organic' : 'Conventional',
              seedVariety: produce.cropName,
              waterSource: 'Rainwater Harvesting',
              pesticides: produce.organic ? 'None - Natural pest control' : 'Regulated pesticides'
            }
          },
          {
            id: '2',
            stage: 'Harvesting',
            title: 'Harvested',
            actor: produce.farmer.name || produce.farmer.username,
            location: produce.farmLocation,
            date: produce.harvestDate,
            time: '05:30 AM',
            description: `Fresh ${produce.cropName} harvested at optimal ripeness`,
            blockchainHash: `0x2b3c4d5e6f7890abcdef1234567890abcdef${produce._id.toString().slice(-2)}34`,
            status: 'COMPLETED',
            details: {
              harvestWeight: produce.quantity,
              qualityGrade: produce.quality,
              harvestConditions: 'Cool morning, optimal humidity',
              packagingDate: produce.harvestDate
            }
          }
        ];

        // Add purchase steps if sold
        if (produce.status === 'SOLD') {
          const purchases = await Purchase.find({ produce: produce._id })
            .populate('buyer seller');

          purchases.forEach((purchase, index) => {
            if (purchase.buyer.role === 'distributor') {
              mockJourney.push({
                id: `${3 + index}`,
                stage: 'Distribution',
                title: 'Picked up by Distributor',
                actor: purchase.buyer.businessName || purchase.buyer.name || purchase.buyer.username,
                location: purchase.buyer.businessAddress || purchase.buyer.location,
                date: purchase.purchaseDate,
                time: '02:00 PM',
                description: 'Produce collected and transported in temperature-controlled vehicle',
                blockchainHash: `0x${3 + index}c4d5e6f7890abcdef1234567890abcdef123456`,
                status: 'COMPLETED',
                details: {
                  transportVehicle: 'Refrigerated Truck',
                  temperature: '4°C maintained',
                  transitTime: '6 hours',
                  qualityCheck: 'Passed - No damage'
                }
              });
            } else if (purchase.buyer.role === 'retailer') {
              mockJourney.push({
                id: `${4 + index}`,
                stage: 'Retail',
                title: 'Received by Retailer',
                actor: purchase.buyer.businessName || purchase.buyer.name || purchase.buyer.username,
                location: purchase.buyer.businessAddress || purchase.buyer.location,
                date: purchase.purchaseDate,
                time: '08:00 AM',
                description: 'Produce received and stocked for sale',
                blockchainHash: `0x${4 + index}d5e6f7890abcdef1234567890abcdef12345678`,
                status: 'COMPLETED',
                details: {
                  receivedQuantity: purchase.quantity,
                  qualityInspection: 'Excellent condition',
                  shelfLife: '5-7 days',
                  pricePerKg: `₹${produce.price}`
                }
              });
            } else if (purchase.buyer.role === 'consumer') {
              mockJourney.push({
                id: `${5 + index}`,
                stage: 'Consumer',
                title: 'Sold to Consumer',
                actor: purchase.buyer.name || purchase.buyer.username,
                location: purchase.buyer.location,
                date: purchase.purchaseDate,
                time: '11:30 AM',
                description: 'Purchased by end consumer',
                blockchainHash: `0x${5 + index}e6f7890abcdef1234567890abcdef1234567890`,
                status: 'COMPLETED',
                details: {
                  purchaseQuantity: purchase.quantity,
                  purchaseAmount: `₹${purchase.totalAmount}`,
                  paymentMethod: 'Digital Payment',
                  customerSatisfaction: purchase.review || 'Excellent quality!'
                }
              });
            }
          });
        }

        return {
          productId: produce._id.toString(),
          productName: produce.cropName,
          batchId: `BATCH-${new Date(produce.harvestDate).getFullYear()}-${new Date(produce.harvestDate).toISOString().slice(5, 10).replace('-', '')}-${produce._id.toString().slice(-3)}`,
          qrCode: produce.qrCode || `data:image/png;base64,${Buffer.from(produce._id.toString()).toString('base64')}`,
          currentStatus: produce.status,
          totalQuantity: produce.quantity,
          currentLocation: produce.farmLocation,
          journey: mockJourney,
          verificationBadges: [
            { type: 'Organic Certified', verified: produce.organic, description: 'Certified organic farming practices' },
            { type: 'Quality Verified', verified: true, description: 'Quality inspection passed' },
            { type: 'Temperature Controlled', verified: true, description: 'Maintained cold chain' },
            { type: 'Traceable Origin', verified: true, description: 'Complete supply chain visibility' }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to trace product: ${error.message}`);
      }
    },

    // Generate QR code for product
    generateQRCode: async (_, { productId }, { user }) => {
      try {
        const produce = await Produce.findById(productId);
        if (!produce) {
          throw new UserInputError('Product not found');
        }

        // In production, you would use a QR code library like 'qrcode'
        const qrCodeData = {
          productId: produce._id.toString(),
          productName: produce.cropName,
          farmer: produce.farmer.toString(),
          harvestDate: produce.harvestDate,
          timestamp: new Date().toISOString()
        };

        const qrCodeString = JSON.stringify(qrCodeData);
        const qrCodeUrl = `data:image/png;base64,${Buffer.from(qrCodeString).toString('base64')}`;

        // Update produce with QR code
        await Produce.findByIdAndUpdate(productId, { qrCode: qrCodeUrl });

        return {
          qrCodeUrl,
          productId: produce._id.toString(),
          data: qrCodeString,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        };
      } catch (error) {
        throw new Error(`Failed to generate QR code: ${error.message}`);
      }
    },

    // Get transaction history for user role
    transactionHistory: async (_, { userRole, userId, filters, limit, offset }, { user }) => {
      try {
        let query = {};
        let transactions = [];

        // Build base query based on user role
        switch (userRole) {
          case 'farmer':
            const farmerPurchases = await Purchase.find({
              seller: userId || user.id
            }).populate('produce buyer seller');
            
            transactions = farmerPurchases.map(purchase => ({
              id: purchase._id.toString(),
              transactionId: `TXN-${purchase._id.toString().slice(-8).toUpperCase()}`,
              date: purchase.purchaseDate.split('T')[0],
              time: new Date(purchase.purchaseDate).toLocaleTimeString(),
              type: 'SALE',
              product: purchase.produce.cropName,
              quantity: purchase.quantity,
              amount: purchase.totalAmount,
              participant: purchase.buyer.businessName || purchase.buyer.name || purchase.buyer.username,
              status: 'COMPLETED',
              blockchainHash: `0x${purchase._id.toString()}abcdef`,
              productId: purchase.produce._id.toString(),
              paymentMethod: 'Bank Transfer',
              commission: purchase.totalAmount * 0.05,
              netAmount: purchase.totalAmount * 0.95,
              location: purchase.produce.farmLocation
            }));
            break;

          case 'distributor':
          case 'retailer':
            const distributorPurchases = await Purchase.find({
              buyer: userId || user.id
            }).populate('produce buyer seller');
            
            transactions = distributorPurchases.map(purchase => ({
              id: purchase._id.toString(),
              transactionId: `TXN-${purchase._id.toString().slice(-8).toUpperCase()}`,
              date: purchase.purchaseDate.split('T')[0],
              time: new Date(purchase.purchaseDate).toLocaleTimeString(),
              type: 'PURCHASE',
              product: purchase.produce.cropName,
              quantity: purchase.quantity,
              amount: purchase.totalAmount,
              participant: purchase.seller.name || purchase.seller.username,
              status: 'COMPLETED',
              blockchainHash: `0x${purchase._id.toString()}abcdef`,
              productId: purchase.produce._id.toString(),
              paymentMethod: 'Digital Payment',
              deliveryStatus: purchase.status,
              expectedDelivery: purchase.deliveryDate
            }));
            break;

          case 'consumer':
            const consumerPurchases = await Purchase.find({
              buyer: userId || user.id
            }).populate('produce seller');
            
            transactions = consumerPurchases.map(purchase => ({
              id: purchase._id.toString(),
              transactionId: `TXN-${purchase._id.toString().slice(-8).toUpperCase()}`,
              date: purchase.purchaseDate.split('T')[0],
              time: new Date(purchase.purchaseDate).toLocaleTimeString(),
              type: 'PURCHASE',
              product: purchase.produce.cropName,
              quantity: purchase.quantity,
              amount: purchase.totalAmount,
              participant: purchase.seller.businessName || purchase.seller.name || purchase.seller.username,
              status: 'COMPLETED',
              blockchainHash: `0x${purchase._id.toString()}abcdef`,
              productId: purchase.produce._id.toString(),
              paymentMethod: 'Digital Payment',
              deliveryAddress: purchase.buyer?.location,
              rating: purchase.rating
            }));
            break;

          case 'admin':
            // Admin sees all transactions
            const allPurchases = await Purchase.find({}).populate('produce buyer seller');
            transactions = allPurchases.map(purchase => ({
              id: purchase._id.toString(),
              transactionId: `TXN-${purchase._id.toString().slice(-8).toUpperCase()}`,
              date: purchase.purchaseDate.split('T')[0],
              time: new Date(purchase.purchaseDate).toLocaleTimeString(),
              type: purchase.buyer.role === 'farmer' ? 'PURCHASE' : 'SALE',
              product: purchase.produce.cropName,
              quantity: purchase.quantity,
              amount: purchase.totalAmount,
              participant: purchase.buyer.businessName || purchase.buyer.name || purchase.buyer.username,
              status: 'COMPLETED',
              blockchainHash: `0x${purchase._id.toString()}abcdef`,
              productId: purchase.produce._id.toString(),
              source: 'Platform Transaction'
            }));
            break;
        }

        // Apply filters
        if (filters) {
          if (filters.search) {
            transactions = transactions.filter(tx => 
              tx.product.toLowerCase().includes(filters.search.toLowerCase()) ||
              tx.transactionId.toLowerCase().includes(filters.search.toLowerCase()) ||
              tx.participant.toLowerCase().includes(filters.search.toLowerCase())
            );
          }

          if (filters.status) {
            transactions = transactions.filter(tx => tx.status === filters.status);
          }

          if (filters.type) {
            transactions = transactions.filter(tx => tx.type === filters.type);
          }

          if (filters.minAmount) {
            transactions = transactions.filter(tx => tx.amount >= filters.minAmount);
          }

          if (filters.maxAmount) {
            transactions = transactions.filter(tx => tx.amount <= filters.maxAmount);
          }

          if (filters.dateRange) {
            const today = new Date();
            let filterDate = new Date();
            
            switch (filters.dateRange) {
              case 'today':
                filterDate.setHours(0, 0, 0, 0);
                break;
              case 'week':
                filterDate.setDate(today.getDate() - 7);
                break;
              case 'month':
                filterDate.setMonth(today.getMonth() - 1);
                break;
              case 'year':
                filterDate.setFullYear(today.getFullYear() - 1);
                break;
            }
            
            transactions = transactions.filter(tx => new Date(tx.date) >= filterDate);
          }
        }

        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Apply pagination
        return transactions.slice(offset, offset + limit);
      } catch (error) {
        throw new Error(`Failed to get transaction history: ${error.message}`);
      }
    },

    // Get analytics data for charts
    analyticsData: async (_, { userRole, timeRange }, { user }) => {
      try {
        // Mock analytics data - in production, this would be calculated from real data
        const mockData = {
          farmer: {
            monthlyEarnings: [
              { month: 'Jan', earnings: 45000, sales: 12, volume: 2400 },
              { month: 'Feb', earnings: 52000, sales: 15, volume: 2800 },
              { month: 'Mar', earnings: 48000, sales: 14, volume: 2600 },
              { month: 'Apr', earnings: 61000, sales: 18, volume: 3200 },
              { month: 'May', earnings: 55000, sales: 16, volume: 2900 },
              { month: 'Jun', earnings: 67000, sales: 20, volume: 3500 },
              { month: 'Jul', earnings: 59000, sales: 17, volume: 3100 },
              { month: 'Aug', earnings: 72000, sales: 22, volume: 3800 },
              { month: 'Sep', earnings: 68000, sales: 19, volume: 3600 }
            ],
            productDistribution: [
              { name: 'Tomatoes', value: 35, count: 145, revenue: 245000 },
              { name: 'Potatoes', value: 25, count: 98, revenue: 185000 },
              { name: 'Carrots', value: 20, count: 76, revenue: 125000 },
              { name: 'Onions', value: 12, count: 45, revenue: 89000 },
              { name: 'Others', value: 8, count: 32, revenue: 67000 }
            ]
          },
          admin: {
            platformMetrics: [
              { month: 'Jan', users: 1245, transactions: 2847, revenue: 47800 },
              { month: 'Feb', users: 1356, transactions: 3124, revenue: 52400 },
              { month: 'Mar', users: 1423, transactions: 3289, revenue: 55200 },
              { month: 'Apr', users: 1567, transactions: 3654, revenue: 61300 },
              { month: 'May', users: 1634, transactions: 3821, revenue: 64100 },
              { month: 'Jun', users: 1789, transactions: 4156, revenue: 69800 },
              { month: 'Jul', users: 1845, transactions: 4298, revenue: 72100 },
              { month: 'Aug', users: 1923, transactions: 4487, revenue: 75400 },
              { month: 'Sep', users: 1998, transactions: 4632, revenue: 77900 }
            ]
          }
        };

        return mockData[userRole] || {};
      } catch (error) {
        throw new Error(`Failed to get analytics data: ${error.message}`);
      }
    }
  },

  Mutation: {
    // Update product journey step
    updateProductJourney: async (_, { productId, stage, title, actor, location, description, details }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('Authentication required');
        }

        const produce = await Produce.findById(productId);
        if (!produce) {
          throw new UserInputError('Product not found');
        }

        // In production, this would update the blockchain and journey tracking
        const blockchainHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
        
        // Mock successful update
        return await traceabilityResolvers.Query.traceProduct(_, { productId }, { user });
      } catch (error) {
        throw new Error(`Failed to update product journey: ${error.message}`);
      }
    }
  }
};

module.exports = traceabilityResolvers;