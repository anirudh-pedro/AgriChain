import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  DollarSign, 
  Package, 
  User, 
  Hash, 
  Eye,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import QRCodeGenerator from '../../components/QRCodeGenerator';

const TransactionHistory = ({ userRole = 'farmer' }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: 'all',
    status: 'all',
    type: 'all',
    minAmount: '',
    maxAmount: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock transaction data for different roles
  const farmerTransactions = [
    {
      id: 'TXN-2025-001',
      date: '2025-09-22',
      time: '11:30 AM',
      type: 'Sale',
      product: 'Organic Tomatoes',
      quantity: '500 kg',
      amount: 25000,
      buyer: 'Green Vegetables Distributor',
      status: 'completed',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      productId: 'AGR-2025-001',
      paymentMethod: 'Bank Transfer',
      commission: 1250,
      netAmount: 23750,
      location: 'Farm Block A, Kharar'
    },
    {
      id: 'TXN-2025-002',
      date: '2025-09-20',
      time: '03:15 PM',
      type: 'Sale',
      product: 'Fresh Potatoes',
      quantity: '1000 kg',
      amount: 30000,
      buyer: 'Local Market Retailer',
      status: 'completed',
      blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef34',
      productId: 'POT-FRESH-789',
      paymentMethod: 'Digital Payment',
      commission: 1500,
      netAmount: 28500,
      location: 'Farm Block B, Kharar'
    },
    {
      id: 'TXN-2025-003',
      date: '2025-09-18',
      time: '09:45 AM',
      type: 'Sale',
      product: 'Organic Carrots',
      quantity: '300 kg',
      amount: 15000,
      buyer: 'Fresh Foods Mart',
      status: 'pending',
      blockchainHash: '0x3c4d5e6f7890abcdef1234567890abcdef56',
      productId: 'CAR-ORG-456',
      paymentMethod: 'Pending',
      commission: 750,
      netAmount: 14250,
      location: 'Farm Block C, Kharar'
    }
  ];

  const distributorTransactions = [
    {
      id: 'TXN-2025-004',
      date: '2025-09-22',
      time: '11:30 AM',
      type: 'Purchase',
      product: 'Organic Tomatoes',
      quantity: '500 kg',
      amount: 25000,
      seller: 'Rajesh Kumar (Farmer)',
      status: 'completed',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      productId: 'AGR-2025-001',
      paymentMethod: 'Bank Transfer',
      deliveryStatus: 'In Transit',
      expectedDelivery: '2025-09-23'
    },
    {
      id: 'TXN-2025-005',
      date: '2025-09-21',
      time: '02:20 PM',
      type: 'Sale',
      product: 'Organic Tomatoes',
      quantity: '200 kg',
      amount: 13000,
      buyer: 'Fresh Foods Mart',
      status: 'completed',
      blockchainHash: '0x4d5e6f7890abcdef1234567890abcdef78',
      productId: 'AGR-2025-001-SPLIT',
      paymentMethod: 'Digital Payment',
      profit: 3000,
      margin: '30%'
    }
  ];

  const consumerTransactions = [
    {
      id: 'TXN-2025-006',
      date: '2025-09-22',
      time: '11:30 AM',
      type: 'Purchase',
      product: 'Organic Tomatoes',
      quantity: '2 kg',
      amount: 130,
      seller: 'Fresh Foods Mart',
      status: 'completed',
      blockchainHash: '0x5e6f7890abcdef1234567890abcdef90',
      productId: 'AGR-2025-001',
      paymentMethod: 'Digital Payment',
      deliveryAddress: 'Mumbai, Maharashtra',
      rating: 5
    }
  ];

  const adminTransactions = [
    ...farmerTransactions,
    ...distributorTransactions,
    ...consumerTransactions,
    {
      id: 'TXN-2025-007',
      date: '2025-09-22',
      time: '12:00 PM',
      type: 'Platform Fee',
      product: 'Commission Collection',
      quantity: 'N/A',
      amount: 5000,
      status: 'completed',
      blockchainHash: '0x6f7890abcdef1234567890abcdef12',
      source: 'Various Transactions'
    }
  ];

  const mockTransactions = {
    farmer: farmerTransactions,
    distributor: distributorTransactions,
    consumer: consumerTransactions,
    admin: adminTransactions
  };

  useEffect(() => {
    setTransactions(mockTransactions[userRole] || []);
    setFilteredTransactions(mockTransactions[userRole] || []);
  }, [userRole]);

  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(txn => 
        txn.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.buyer && txn.buyer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (txn.seller && txn.seller.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Date range filter
    if (selectedFilters.dateRange !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (selectedFilters.dateRange) {
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
      
      filtered = filtered.filter(txn => new Date(txn.date) >= filterDate);
    }

    // Status filter
    if (selectedFilters.status !== 'all') {
      filtered = filtered.filter(txn => txn.status === selectedFilters.status);
    }

    // Type filter
    if (selectedFilters.type !== 'all') {
      filtered = filtered.filter(txn => txn.type.toLowerCase() === selectedFilters.type);
    }

    // Amount range filter
    if (selectedFilters.minAmount) {
      filtered = filtered.filter(txn => txn.amount >= parseInt(selectedFilters.minAmount));
    }
    if (selectedFilters.maxAmount) {
      filtered = filtered.filter(txn => txn.amount <= parseInt(selectedFilters.maxAmount));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'product':
          comparison = a.product.localeCompare(b.product);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, selectedFilters, sortBy, sortOrder]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={16} />;
      case 'pending': return <Clock className="text-orange-600" size={16} />;
      case 'failed': return <AlertCircle className="text-red-600" size={16} />;
      default: return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'failed': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'sale': return <ArrowUpRight className="text-green-600" size={16} />;
      case 'purchase': return <ArrowDownRight className="text-blue-600" size={16} />;
      default: return <Package className="text-gray-600" size={16} />;
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Type', 'Product', 'Quantity', 'Amount', 'Status', 'Blockchain Hash'],
      ...filteredTransactions.map(txn => [
        txn.date,
        txn.id,
        txn.type,
        txn.product,
        txn.quantity,
        `₹${txn.amount}`,
        txn.status,
        txn.blockchainHash
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agrichain-transactions-${userRole}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const completedTransactions = filteredTransactions.filter(txn => txn.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">Transaction History</h1>
          <p className="text-emerald-600 text-lg">Track all your blockchain-verified transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <Package className="text-blue-600" size={24} />
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">{filteredTransactions.length}</h3>
            <p className="text-emerald-600 text-sm">Total Transactions</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-600 text-sm font-medium">
                {Math.round((completedTransactions / filteredTransactions.length) * 100) || 0}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">{completedTransactions}</h3>
            <p className="text-emerald-600 text-sm">Completed</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-emerald-600" size={24} />
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">₹{totalAmount.toLocaleString()}</h3>
            <p className="text-emerald-600 text-sm">Total Value</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-2">
              <Hash className="text-purple-600" size={24} />
              <CheckCircle className="text-green-500" size={16} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">100%</h3>
            <p className="text-emerald-600 text-sm">Blockchain Verified</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl text-emerald-800 placeholder-emerald-500 focus:outline-none focus:border-emerald-400 focus:bg-white/80 transition-all"
                placeholder="Search transactions, products, or participants..."
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
              <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>

            {/* Export Button */}
            <button
              onClick={exportTransactions}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
            >
              <Download size={20} />
              <span>Export</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-emerald-700 text-sm font-medium mb-2">Date Range</label>
                  <select
                    value={selectedFilters.dateRange}
                    onChange={(e) => setSelectedFilters({...selectedFilters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-emerald-800 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-700 text-sm font-medium mb-2">Status</label>
                  <select
                    value={selectedFilters.status}
                    onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                    className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-emerald-800 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-700 text-sm font-medium mb-2">Type</label>
                  <select
                    value={selectedFilters.type}
                    onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
                    className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-emerald-800 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="all">All Types</option>
                    <option value="sale">Sale</option>
                    <option value="purchase">Purchase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-700 text-sm font-medium mb-2">Min Amount</label>
                  <input
                    type="number"
                    value={selectedFilters.minAmount}
                    onChange={(e) => setSelectedFilters({...selectedFilters, minAmount: e.target.value})}
                    className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-emerald-800 focus:outline-none focus:border-emerald-400"
                    placeholder="₹0"
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 text-sm font-medium mb-2">Max Amount</label>
                  <input
                    type="number"
                    value={selectedFilters.maxAmount}
                    onChange={(e) => setSelectedFilters({...selectedFilters, maxAmount: e.target.value})}
                    className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-emerald-800 focus:outline-none focus:border-emerald-400"
                    placeholder="₹100000"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/40 border-b border-white/30">
                <tr>
                  <th className="text-left p-4 text-emerald-800 font-semibold">
                    <button
                      onClick={() => {
                        setSortBy('date');
                        setSortOrder(sortBy === 'date' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                      className="flex items-center space-x-1 hover:text-emerald-600"
                    >
                      <Calendar size={16} />
                      <span>Date</span>
                    </button>
                  </th>
                  <th className="text-left p-4 text-emerald-800 font-semibold">Transaction</th>
                  <th className="text-left p-4 text-emerald-800 font-semibold">
                    <button
                      onClick={() => {
                        setSortBy('product');
                        setSortOrder(sortBy === 'product' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                      className="flex items-center space-x-1 hover:text-emerald-600"
                    >
                      <Package size={16} />
                      <span>Product</span>
                    </button>
                  </th>
                  <th className="text-left p-4 text-emerald-800 font-semibold">Participant</th>
                  <th className="text-left p-4 text-emerald-800 font-semibold">
                    <button
                      onClick={() => {
                        setSortBy('amount');
                        setSortOrder(sortBy === 'amount' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                      className="flex items-center space-x-1 hover:text-emerald-600"
                    >
                      <DollarSign size={16} />
                      <span>Amount</span>
                    </button>
                  </th>
                  <th className="text-left p-4 text-emerald-800 font-semibold">Status</th>
                  <th className="text-left p-4 text-emerald-800 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/20 hover:bg-white/40 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-emerald-800 font-medium">{transaction.date}</p>
                        <p className="text-emerald-600 text-sm">{transaction.time}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <p className="text-emerald-800 font-medium">{transaction.id}</p>
                          <p className="text-emerald-600 text-sm">{transaction.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-emerald-800 font-medium">{transaction.product}</p>
                        <p className="text-emerald-600 text-sm">{transaction.quantity}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-emerald-500" />
                        <span className="text-emerald-800">
                          {transaction.buyer || transaction.seller || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-800 font-bold">₹{transaction.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        <Eye size={16} />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto mb-4 text-emerald-400" size={48} />
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No Transactions Found</h3>
              <p className="text-emerald-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Transaction Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Transaction ID</p>
                    <p className="font-semibold text-gray-800">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Product ID</p>
                    <p className="font-semibold text-gray-800">{selectedTransaction.productId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date & Time</p>
                    <p className="font-semibold text-gray-800">{selectedTransaction.date} {selectedTransaction.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedTransaction.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <QRCodeGenerator 
                    data={selectedTransaction.productId} 
                    size={150}
                    className="max-w-xs"
                  />
                </div>

                {/* Blockchain Hash */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-medium mb-2">Blockchain Transaction Hash:</p>
                  <p className="font-mono text-sm text-gray-800 break-all">{selectedTransaction.blockchainHash}</p>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(selectedTransaction)
                    .filter(([key]) => !['id', 'date', 'time', 'status', 'blockchainHash', 'productId'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium text-gray-800">
                          {typeof value === 'number' && key.includes('amount') ? `₹${value.toLocaleString()}` : value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;