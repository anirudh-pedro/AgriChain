import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_ALL_PRODUCE } from '../../utils/queries';
import { Truck, Package, TrendingUp, Clock, Search, MapPin, BarChart3, AlertCircle } from 'lucide-react';

const DistributorDashboard = ({ currentUser, onViewProduce, onTrackShipment, onQualityCheck }) => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');

  // Temporarily using mock data instead of GraphQL
  const loading = false;
  const error = null;
  const data = {
    getAllProduce: {
      success: true,
      data: [
        {
          id: 'PROD-003-2024',
          produceType: 'Bell Peppers',
          quantity: { amount: 100, unit: 'kg' },
          status: 'in_transit'
        },
        {
          id: 'PROD-004-2024',
          produceType: 'Carrots',
          quantity: { amount: 75, unit: 'kg' },
          status: 'delivered'
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

  const calculateDistributorStats = (produces) => {
    if (!produces || !Array.isArray(produces)) {
      return {
        inTransit: 0,
        delivered: 0,
        totalVolume: 0,
        avgDeliveryTime: 0
      };
    }

    const inTransit = produces.filter(p => p.status === 'in_transit').length;
    const delivered = produces.filter(p => p.status === 'delivered').length;
    const totalVolume = produces.reduce((sum, p) => sum + (p.quantity?.amount || 0), 0);

    return {
      inTransit,
      delivered,
      totalVolume,
      avgDeliveryTime: 2.5 // Mock average delivery time in days
    };
  };

  const stats = data?.getAllProduce?.success ? calculateDistributorStats(data.getAllProduce.data) : calculateDistributorStats([]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in_transit':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'delayed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Mock active shipments data
  const activeShipments = [
    {
      id: 'SH001',
      produceType: 'Organic Tomatoes',
      quantity: '500 kg',
      from: 'Green Valley Farm',
      to: 'Metro Supermarket',
      status: 'in_transit',
      priority: 'high',
      estimatedDelivery: '2024-01-15T14:00:00Z',
      currentLocation: 'Highway Distribution Center'
    },
    {
      id: 'SH002',
      produceType: 'Fresh Lettuce',
      quantity: '200 kg',
      from: 'Sunny Acres',
      to: 'Local Grocery Chain',
      status: 'pending',
      priority: 'medium',
      estimatedDelivery: '2024-01-16T10:00:00Z',
      currentLocation: 'Warehouse A'
    },
    {
      id: 'SH003',
      produceType: 'Bell Peppers',
      quantity: '300 kg',
      from: 'Fresh Fields Farm',
      to: 'Restaurant Group',
      status: 'delayed',
      priority: 'high',
      estimatedDelivery: '2024-01-14T16:00:00Z',
      currentLocation: 'Route 45 - Traffic Delay'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Truck className="h-8 w-8 mr-3 text-blue-600" />
            Distributor Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name || 'Distributor'}!</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="in_transit">In Transit</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
              <p className="text-xs text-gray-500">Active shipments</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              <p className="text-xs text-gray-500">{getTimeRangeLabel()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVolume.toLocaleString()}</p>
              <p className="text-xs text-gray-500">kg {getTimeRangeLabel()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Delivery Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgDeliveryTime}</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Shipments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Shipments</h3>
            <button
              onClick={() => onTrackShipment && onTrackShipment()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Track All
            </button>
          </div>

          <div className="space-y-4">
            {activeShipments.map((shipment) => (
              <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">#{shipment.id}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(shipment.priority)}`}>
                      {shipment.priority} priority
                    </span>
                  </div>
                  <button
                    onClick={() => onTrackShipment && onTrackShipment(shipment.id)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Product: <span className="font-medium text-gray-900">{shipment.produceType}</span></p>
                    <p className="text-gray-600">Quantity: <span className="font-medium text-gray-900">{shipment.quantity}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-600">From: <span className="font-medium text-gray-900">{shipment.from}</span></p>
                    <p className="text-gray-600">To: <span className="font-medium text-gray-900">{shipment.to}</span></p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    Current: {shipment.currentLocation}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    ETA: {formatDate(shipment.estimatedDelivery)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => onTrackShipment && onTrackShipment()}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Track Shipment</p>
                  <p className="text-xs text-gray-600">Monitor delivery progress</p>
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
                  <p className="text-xs text-gray-600">Inspect received goods</p>
                </div>
              </button>

              <button
                onClick={() => onViewProduce && onViewProduce()}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Inventory</p>
                  <p className="text-xs text-gray-600">Check available products</p>
                </div>
              </button>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Delayed Shipment</p>
                  <p className="text-xs text-red-700">SH003 is 2 hours behind schedule</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Quality Check Due</p>
                  <p className="text-xs text-yellow-700">3 shipments awaiting inspection</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">New Shipment Available</p>
                  <p className="text-xs text-blue-700">2 new orders ready for pickup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="text-gray-900 font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Quality Rating</span>
                  <span className="text-gray-900 font-medium">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '96%'}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Capacity Utilization</span>
                  <span className="text-gray-900 font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;