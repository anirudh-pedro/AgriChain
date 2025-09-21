import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_ALL_PRODUCE } from '../../utils/queries';
import { Store, TrendingUp, Package, Users, AlertTriangle, Clock, BarChart3, ShoppingCart } from 'lucide-react';

const RetailerDashboard = ({ currentUser, onOrderProduce, onViewInventory, onQualityCheck, onViewAnalytics }) => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Temporarily using mock data instead of GraphQL
  const loading = false;
  const error = null;
  const data = {
    getAllProduce: {
      success: true,
      data: [
        {
          id: 'PROD-005-2024',
          produceType: 'Organic Tomatoes',
          quantity: { amount: 200, unit: 'kg' },
          status: 'available'
        },
        {
          id: 'PROD-006-2024',
          produceType: 'Fresh Lettuce',
          quantity: { amount: 150, unit: 'kg' },
          status: 'available'
        }
      ]
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeFilter) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  const calculateRetailerStats = (produces) => {
    if (!produces || !Array.isArray(produces)) {
      return {
        availableProducts: 0,
        lowStockItems: 0,
        totalOrders: 0,
        customerSatisfaction: 0
      };
    }

    // Mock calculations for retailer-specific metrics
    return {
      availableProducts: produces.length,
      lowStockItems: Math.floor(produces.length * 0.15), // 15% low stock
      totalOrders: 142, // Mock value
      customerSatisfaction: 4.7 // Mock rating
    };
  };

  const stats = data?.getAllProduce?.success ? calculateRetailerStats(data.getAllProduce.data) : calculateRetailerStats([]);

  // Mock inventory data
  const inventoryItems = [
    {
      id: 'INV-001',
      name: 'Organic Tomatoes',
      category: 'Vegetables',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      supplier: 'Green Valley Farm',
      lastRestocked: '2024-01-10',
      avgSalesPerDay: 8,
      status: 'in_stock'
    },
    {
      id: 'INV-002',
      name: 'Fresh Lettuce',
      category: 'Leafy Greens',
      currentStock: 12,
      minStock: 15,
      maxStock: 50,
      supplier: 'Sunny Acres',
      lastRestocked: '2024-01-08',
      avgSalesPerDay: 6,
      status: 'low_stock'
    },
    {
      id: 'INV-003',
      name: 'Bell Peppers',
      category: 'Vegetables',
      currentStock: 0,
      minStock: 10,
      maxStock: 80,
      supplier: 'Fresh Fields Farm',
      lastRestocked: '2024-01-05',
      avgSalesPerDay: 4,
      status: 'out_of_stock'
    },
    {
      id: 'INV-004',
      name: 'Organic Carrots',
      category: 'Root Vegetables',
      currentStock: 78,
      minStock: 25,
      maxStock: 120,
      supplier: 'Heritage Farms',
      lastRestocked: '2024-01-12',
      avgSalesPerDay: 5,
      status: 'in_stock'
    }
  ];

  // Mock sales data
  const salesData = [
    { category: 'Vegetables', sales: 45, trend: '+12%' },
    { category: 'Fruits', sales: 38, trend: '+8%' },
    { category: 'Leafy Greens', sales: 29, trend: '-3%' },
    { category: 'Root Vegetables', sales: 22, trend: '+15%' }
  ];

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'text-green-600 bg-green-100';
      case 'low_stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStockLevel = (current, min, max) => {
    const percentage = (current / max) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Store className="h-8 w-8 mr-3 text-orange-600" />
            Retailer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name || 'Retailer'}!</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="leafy_greens">Leafy Greens</option>
            <option value="root_vegetables">Root Vegetables</option>
          </select>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableProducts}</p>
              <p className="text-xs text-gray-500">In inventory</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              <p className="text-xs text-gray-500">Need reorder</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500">{getTimeRangeLabel()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}</p>
              <p className="text-xs text-gray-500">out of 5.0</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Status */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
            <button
              onClick={() => onViewInventory && onViewInventory()}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              View Full Inventory
            </button>
          </div>

          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category} • Supplier: {item.supplier}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Current Stock</p>
                    <p className="font-medium text-gray-900">{item.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg. Daily Sales</p>
                    <p className="font-medium text-gray-900">{item.avgSalesPerDay} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Last Restocked</p>
                    <p className="font-medium text-gray-900">{formatDate(item.lastRestocked)}</p>
                  </div>
                </div>

                {/* Stock Level Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Stock Level</span>
                    <span>{item.currentStock}/{item.maxStock}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'out_of_stock' ? 'bg-red-600' :
                        item.status === 'low_stock' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{width: `${getStockLevel(item.currentStock, item.minStock, item.maxStock)}%`}}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                {item.status !== 'in_stock' && (
                  <button
                    onClick={() => onOrderProduce && onOrderProduce(item.id)}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    {item.status === 'out_of_stock' ? 'Reorder Now' : 'Order More Stock'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Sales Analytics */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => onOrderProduce && onOrderProduce()}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
              >
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <ShoppingCart className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Order Produce</p>
                  <p className="text-xs text-gray-600">Browse and order from suppliers</p>
                </div>
              </button>

              <button
                onClick={() => onQualityCheck && onQualityCheck()}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Quality Check</p>
                  <p className="text-xs text-gray-600">Inspect received products</p>
                </div>
              </button>

              <button
                onClick={() => onViewAnalytics && onViewAnalytics()}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-xs text-gray-600">Sales and inventory reports</p>
                </div>
              </button>
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
            
            <div className="space-y-4">
              {salesData.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className={`text-sm font-medium ${
                      category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.trend}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{width: `${category.sales}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{category.sales}% of total sales</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Out of Stock</p>
                  <p className="text-xs text-red-700">Bell Peppers - 0 units remaining</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Low Stock Warning</p>
                  <p className="text-xs text-yellow-700">Fresh Lettuce - Only 12 units left</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">High Demand Alert</p>
                  <p className="text-xs text-blue-700">Organic Carrots sales up 15% this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;