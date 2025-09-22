import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Ban, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Database,
  Server,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Globe,
  Clock,
  Hash,
  DollarSign
} from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for users
  const mockUsers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@farmer.com',
      role: 'farmer',
      status: 'active',
      joinDate: '2025-08-15',
      lastLogin: '2025-09-22',
      aadhaarId: '123456789012',
      landLocation: 'Village Kharar, Punjab',
      typeOfProduce: 'vegetables'
    },
    {
      id: 2,
      name: 'Green Fresh Distributors',
      email: 'contact@greenfresh.com',
      role: 'distributor',
      status: 'active',
      joinDate: '2025-08-20',
      lastLogin: '2025-09-22',
      gstin: '22AAAAA0000A1Z5',
      businessName: 'Green Fresh Distributors'
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit@consumer.com',
      role: 'consumer',
      status: 'pending',
      joinDate: '2025-09-20',
      lastLogin: '2025-09-21'
    },
    {
      id: 4,
      name: 'Suspicious User',
      email: 'suspicious@test.com',
      role: 'farmer',
      status: 'banned',
      joinDate: '2025-09-01',
      lastLogin: '2025-09-10',
      reason: 'Fraudulent activity detected'
    }
  ];

  // Mock blockchain transactions
  const mockTransactions = [
    {
      id: 1,
      hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
      type: 'Produce Registration',
      farmer: 'Rajesh Kumar',
      cropName: 'Organic Tomatoes',
      quantity: '500 kg',
      timestamp: '2025-09-22T10:30:00Z',
      status: 'confirmed',
      blockNumber: 12345,
      gasUsed: '21000'
    },
    {
      id: 2,
      hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a',
      type: 'Purchase Transaction',
      buyer: 'Green Fresh Distributors',
      seller: 'Rajesh Kumar',
      amount: '₹25,000',
      timestamp: '2025-09-22T11:15:00Z',
      status: 'confirmed',
      blockNumber: 12346,
      gasUsed: '35000'
    },
    {
      id: 3,
      hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b',
      type: 'Quality Verification',
      inspector: 'Quality Control Officer',
      cropName: 'Organic Carrots',
      status: 'pending',
      timestamp: '2025-09-22T12:00:00Z',
      blockNumber: null,
      gasUsed: null
    }
  ];

  // Mock system health data
  const mockSystemHealth = {
    blockchain: {
      status: 'healthy',
      peers: 4,
      activeChannels: 1,
      transactions24h: 156,
      lastBlockTime: '2025-09-22T12:30:00Z'
    },
    database: {
      status: 'healthy',
      connections: 45,
      responseTime: '12ms',
      storage: '2.3 GB / 10 GB'
    },
    api: {
      status: 'healthy',
      requests24h: 1250,
      successRate: 99.8,
      avgResponseTime: '145ms'
    },
    users: {
      total: 1234,
      active24h: 89,
      newToday: 12,
      bannedUsers: 3
    }
  };

  useEffect(() => {
    setUsers(mockUsers);
    setTransactions(mockTransactions);
    setSystemHealth(mockSystemHealth);
  }, []);

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: action === 'approve' ? 'active' : action === 'ban' ? 'banned' : user.status }
        : user
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'banned': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color, status }) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {status && (
          <div className={`w-3 h-3 rounded-full ${status === 'healthy' ? 'bg-green-400' : status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`} />
        )}
        {change && (
          <span className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-purple-200 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={systemHealth.users?.total}
          change={8.5}
          color="bg-gradient-to-r from-blue-500 to-cyan-600"
        />
        <StatCard
          icon={Activity}
          title="Active Users (24h)"
          value={systemHealth.users?.active24h}
          change={12.3}
          color="bg-gradient-to-r from-green-500 to-emerald-600"
        />
        <StatCard
          icon={Database}
          title="Blockchain Status"
          value="Healthy"
          status={systemHealth.blockchain?.status}
          color="bg-gradient-to-r from-purple-500 to-pink-600"
        />
        <StatCard
          icon={Server}
          title="API Requests (24h)"
          value={systemHealth.api?.requests24h}
          change={5.2}
          color="bg-gradient-to-r from-orange-500 to-red-600"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'manage-users', label: 'Manage Users', icon: Users },
            { id: 'blockchain-transactions', label: 'Blockchain', icon: Database },
            { id: 'system-health', label: 'System Health', icon: Server }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New user registration', user: 'Amit Singh', time: '5 minutes ago', type: 'user' },
                  { action: 'Produce registered', user: 'Rajesh Kumar', time: '12 minutes ago', type: 'produce' },
                  { action: 'Transaction completed', user: 'Green Fresh Distributors', time: '18 minutes ago', type: 'transaction' },
                  { action: 'User approved', user: 'Priya Sharma', time: '25 minutes ago', type: 'admin' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'user' ? 'bg-blue-500/20' :
                        activity.type === 'produce' ? 'bg-green-500/20' :
                        activity.type === 'transaction' ? 'bg-purple-500/20' : 'bg-orange-500/20'
                      }`}>
                        {activity.type === 'user' ? <Users size={16} className="text-blue-400" /> :
                         activity.type === 'produce' ? <Database size={16} className="text-green-400" /> :
                         activity.type === 'transaction' ? <DollarSign size={16} className="text-purple-400" /> :
                         <Shield size={16} className="text-orange-400" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{activity.action}</p>
                        <p className="text-purple-200 text-xs">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-purple-300 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">System Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Blockchain Transactions Today</span>
                  <span className="text-white font-semibold">{systemHealth.blockchain?.transactions24h}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">API Success Rate</span>
                  <span className="text-green-400 font-semibold">{systemHealth.api?.successRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Active Blockchain Peers</span>
                  <span className="text-white font-semibold">{systemHealth.blockchain?.peers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Database Response Time</span>
                  <span className="text-white font-semibold">{systemHealth.database?.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">New Users Today</span>
                  <span className="text-white font-semibold">{systemHealth.users?.newToday}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manage-users' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Management</h3>
              <div className="flex space-x-2">
                <span className="text-purple-200 text-sm">Total: {users.length} users</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/20">
                    <th className="pb-3 text-purple-200 font-medium">User</th>
                    <th className="pb-3 text-purple-200 font-medium">Role</th>
                    <th className="pb-3 text-purple-200 font-medium">Status</th>
                    <th className="pb-3 text-purple-200 font-medium">Join Date</th>
                    <th className="pb-3 text-purple-200 font-medium">Last Login</th>
                    <th className="pb-3 text-purple-200 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-white/10">
                      <td className="py-4">
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-purple-200 text-sm">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="capitalize text-purple-200">{user.role}</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-purple-200 text-sm">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-purple-200 text-sm">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          {user.status === 'pending' && (
                            <button
                              onClick={() => handleUserAction(user.id, 'approve')}
                              className="text-green-400 hover:text-green-300 transition-colors"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {user.status !== 'banned' && (
                            <button
                              onClick={() => handleUserAction(user.id, 'ban')}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-lg w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">User Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-purple-200 text-sm">Name</p>
                    <p className="text-white font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Email</p>
                    <p className="text-white font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Role</p>
                    <p className="text-white font-medium capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  
                  {selectedUser.aadhaarId && (
                    <div>
                      <p className="text-purple-200 text-sm">Aadhaar ID</p>
                      <p className="text-white font-medium">{selectedUser.aadhaarId}</p>
                    </div>
                  )}
                  
                  {selectedUser.gstin && (
                    <div>
                      <p className="text-purple-200 text-sm">GSTIN</p>
                      <p className="text-white font-medium">{selectedUser.gstin}</p>
                    </div>
                  )}
                  
                  {selectedUser.reason && (
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-400/20">
                      <p className="text-red-400 text-sm font-medium">Reason for Ban</p>
                      <p className="text-red-300 text-sm">{selectedUser.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'blockchain-transactions' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Blockchain Transactions</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {transactions.map(transaction => (
                <div key={transaction.id} className="p-4 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.status === 'confirmed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {transaction.status === 'confirmed' ? 
                          <CheckCircle size={20} className="text-green-400" /> :
                          <Clock size={20} className="text-yellow-400" />
                        }
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{transaction.type}</h4>
                        <p className="text-purple-200 text-sm">{transaction.cropName || transaction.amount}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      transaction.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-400 border-green-400/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-purple-200">Transaction Hash</p>
                      <p className="text-white font-mono text-xs">{transaction.hash.substring(0, 20)}...</p>
                    </div>
                    <div>
                      <p className="text-purple-200">Block Number</p>
                      <p className="text-white font-medium">{transaction.blockNumber || 'Pending'}</p>
                    </div>
                    <div>
                      <p className="text-purple-200">Gas Used</p>
                      <p className="text-white font-medium">{transaction.gasUsed || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-purple-200">Timestamp</p>
                      <p className="text-white font-medium">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {(transaction.farmer || transaction.buyer) && (
                    <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        {transaction.farmer && (
                          <span className="text-purple-200">
                            <strong>Farmer:</strong> {transaction.farmer}
                          </span>
                        )}
                        {transaction.buyer && (
                          <span className="text-purple-200">
                            <strong>Buyer:</strong> {transaction.buyer}
                          </span>
                        )}
                        {transaction.seller && (
                          <span className="text-purple-200">
                            <strong>Seller:</strong> {transaction.seller}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system-health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blockchain Health */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Blockchain</h3>
                <div className={`w-3 h-3 rounded-full ${getHealthColor(systemHealth.blockchain?.status) === 'text-green-400' ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Status</span>
                  <span className={`font-medium ${getHealthColor(systemHealth.blockchain?.status)}`}>
                    {systemHealth.blockchain?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Active Peers</span>
                  <span className="text-white font-medium">{systemHealth.blockchain?.peers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Transactions (24h)</span>
                  <span className="text-white font-medium">{systemHealth.blockchain?.transactions24h}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Last Block</span>
                  <span className="text-white font-medium text-xs">
                    {new Date(systemHealth.blockchain?.lastBlockTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Database Health */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Database</h3>
                <div className={`w-3 h-3 rounded-full ${getHealthColor(systemHealth.database?.status) === 'text-green-400' ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Status</span>
                  <span className={`font-medium ${getHealthColor(systemHealth.database?.status)}`}>
                    {systemHealth.database?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Connections</span>
                  <span className="text-white font-medium">{systemHealth.database?.connections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Response Time</span>
                  <span className="text-white font-medium">{systemHealth.database?.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Storage Used</span>
                  <span className="text-white font-medium text-xs">{systemHealth.database?.storage}</span>
                </div>
              </div>
            </div>

            {/* API Health */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">API Server</h3>
                <div className={`w-3 h-3 rounded-full ${getHealthColor(systemHealth.api?.status) === 'text-green-400' ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Status</span>
                  <span className={`font-medium ${getHealthColor(systemHealth.api?.status)}`}>
                    {systemHealth.api?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Requests (24h)</span>
                  <span className="text-white font-medium">{systemHealth.api?.requests24h}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Success Rate</span>
                  <span className="text-green-400 font-medium">{systemHealth.api?.successRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Avg Response</span>
                  <span className="text-white font-medium">{systemHealth.api?.avgResponseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">System Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-400/20">
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-green-300">All systems operational</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <AlertTriangle size={20} className="text-yellow-400" />
                <span className="text-yellow-300">Database storage at 23% - monitor closely</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;