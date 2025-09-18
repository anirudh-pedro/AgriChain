import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTransactions: 156,
    confirmedTransactions: 142,
    pendingTransactions: 8,
    failedTransactions: 6,
    transactionsToday: 12,
    transactionsThisWeek: 89,
    transactionsThisMonth: 156
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // This will be replaced with actual API calls once backend is connected
    console.log('Dashboard will load real data once database is connected');
  }, []);

  const statCards = [
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      icon: FileText,
      color: 'blue',
      change: '+12% from last month'
    },
    {
      title: 'Confirmed',
      value: stats?.confirmedTransactions || 0,
      icon: CheckCircle,
      color: 'green',
      change: `${stats ? ((stats.confirmedTransactions / stats.totalTransactions) * 100).toFixed(1) : 0}% of total`
    },
    {
      title: 'Pending',
      value: stats?.pendingTransactions || 0,
      icon: Clock,
      color: 'yellow',
      change: 'Processing now'
    },
    {
      title: 'Failed',
      value: stats?.failedTransactions || 0,
      icon: XCircle,
      color: 'red',
      change: 'Needs attention'
    }
  ];

  const timeStats = [
    { label: 'Today', value: stats?.transactionsToday || 0 },
    { label: 'This Week', value: stats?.transactionsThisWeek || 0 },
    { label: 'This Month', value: stats?.transactionsThisMonth || 0 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error loading dashboard: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your blockchain data management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-600 bg-blue-50',
            green: 'bg-green-500 text-green-600 bg-green-50',
            yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
            red: 'bg-red-500 text-red-600 bg-red-50'
          };
          
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${colorClasses[stat.color].split(' ')[2]}`}>
                  <Icon className={`h-6 w-6 ${colorClasses[stat.color].split(' ')[1]}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time-based Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {timeStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/submit"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="p-2 bg-blue-100 rounded-md">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Submit Transaction</p>
              <p className="text-sm text-gray-500">Add new data to blockchain</p>
            </div>
          </a>

          <a
            href="/batch-upload"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="p-2 bg-green-100 rounded-md">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Batch Upload</p>
              <p className="text-sm text-gray-500">Upload CSV/JSON files</p>
            </div>
          </a>

          <a
            href="/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="p-2 bg-purple-100 rounded-md">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Data insights and trends</p>
            </div>
          </a>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Blockchain Network</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Server</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;