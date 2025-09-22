import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

// Mock analytics data (moved outside component to prevent re-creation)
const mockAnalyticsData = {
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
      ],
      buyerTypes: [
        { name: 'Distributors', value: 45, transactions: 234 },
        { name: 'Retailers', value: 35, transactions: 187 },
        { name: 'Direct Consumers', value: 20, transactions: 98 }
      ]
    },
    distributor: {
      monthlyData: [
        { month: 'Jan', purchases: 125000, sales: 145000, profit: 20000, margin: 16 },
        { month: 'Feb', purchases: 135000, sales: 158000, profit: 23000, margin: 17 },
        { month: 'Mar', purchases: 128000, sales: 149000, profit: 21000, margin: 16.4 },
        { month: 'Apr', purchases: 142000, sales: 167000, profit: 25000, margin: 17.6 },
        { month: 'May', purchases: 138000, sales: 162000, profit: 24000, margin: 17.4 },
        { month: 'Jun', purchases: 155000, sales: 183000, profit: 28000, margin: 18.1 },
        { month: 'Jul', purchases: 148000, sales: 174000, profit: 26000, margin: 17.6 },
        { month: 'Aug', purchases: 162000, sales: 192000, profit: 30000, margin: 18.5 },
        { month: 'Sep', purchases: 158000, sales: 187000, profit: 29000, margin: 18.3 }
      ]
    },
    consumer: {
      purchaseHistory: [
        { month: 'Jan', purchases: 12, amount: 2400, organic: 8 },
        { month: 'Feb', purchases: 15, amount: 2850, organic: 11 },
        { month: 'Mar', purchases: 13, amount: 2600, organic: 9 },
        { month: 'Apr', purchases: 18, amount: 3200, organic: 14 },
        { month: 'May', purchases: 16, amount: 2950, organic: 12 },
        { month: 'Jun', purchases: 20, amount: 3500, organic: 16 },
        { month: 'Jul', purchases: 17, amount: 3100, organic: 13 },
        { month: 'Aug', purchases: 22, amount: 3800, organic: 18 },
        { month: 'Sep', purchases: 19, amount: 3400, organic: 15 }
      ],
      preferences: [
        { category: 'Organic Vegetables', value: 40, spending: 15600 },
        { category: 'Fresh Fruits', value: 25, spending: 9750 },
        { category: 'Grains', value: 20, spending: 7800 },
        { category: 'Herbs & Spices', value: 15, spending: 5850 }
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
      ],
      userGrowth: [
        { type: 'Farmers', count: 456, growth: 12.5 },
        { type: 'Distributors', count: 234, growth: 8.3 },
        { type: 'Retailers', count: 567, growth: 15.2 },
        { type: 'Consumers', count: 741, growth: 22.1 }
      ]
    }
  };

const AnalyticsDashboard = ({ userRole = 'farmer' }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData[userRole] || {});
      setIsLoading(false);
    }, 1000);
  }, [userRole, timeRange]);

  const StatCard = ({ icon: Icon, title, value, change, color, suffix = '' }) => (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change > 0 ? (
              <TrendingUp className="text-green-500" size={16} />
            ) : (
              <TrendingDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-emerald-800 mb-1">{value}{suffix}</h3>
      <p className="text-emerald-600 text-sm">{title}</p>
    </div>
  );

  // Simple Bar Chart Component
  const SimpleBarChart = ({ data, dataKey, nameKey, title, color = 'bg-emerald-500' }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-emerald-800">{title}</h3>
          <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-500">
            <Download size={16} />
            <span className="text-sm">Export</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-emerald-700 font-medium">
                {item[nameKey]}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div 
                  className={`${color} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-1000`}
                  style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {typeof item[dataKey] === 'number' && (dataKey.includes('earnings') || dataKey.includes('amount') || dataKey.includes('revenue'))
                      ? `₹${item[dataKey].toLocaleString()}`
                      : item[dataKey]
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple Line Chart Component  
  const SimpleLineChart = ({ data, dataKey, nameKey, title }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    const minValue = Math.min(...data.map(item => item[dataKey]));
    const range = maxValue - minValue;
    
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <h3 className="text-xl font-bold text-emerald-800 mb-6">{title}</h3>
        
        <div className="relative h-64 bg-gradient-to-t from-emerald-50 to-transparent rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line 
                key={i}
                x1="0" 
                y1={i * 50} 
                x2="400" 
                y2={i * 50}
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 400;
                const y = 200 - ((item[dataKey] - minValue) / range) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 200 - ((item[dataKey] - minValue) / range) * 180;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#10b981"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>{item[nameKey]}: {item[dataKey]}</title>
                </circle>
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-emerald-600">
            {data.map((item, index) => (
              <span key={index}>{item[nameKey]}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Simple Pie Chart Component
  const SimplePieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <h3 className="text-xl font-bold text-emerald-800 mb-6">{title}</h3>
        
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (item.value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                // Calculate path for pie slice
                const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={colors[index % colors.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <title>{item.name}: {percentage.toFixed(1)}%</title>
                  </path>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="text-sm text-emerald-700">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-emerald-600" size={48} />
          <p className="text-emerald-700 font-medium">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">Analytics Dashboard</h1>
            <p className="text-emerald-600 text-lg">
              {userRole === 'farmer' && 'Track your farming performance and earnings'}
              {userRole === 'distributor' && 'Monitor your distribution metrics and profits'}
              {userRole === 'consumer' && 'Analyze your purchase patterns and preferences'}
              {userRole === 'admin' && 'Platform-wide insights and user analytics'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/60 border border-white/40 rounded-xl text-emerald-800 focus:outline-none focus:border-emerald-400"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Farmer Analytics */}
        {userRole === 'farmer' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                title="Total Earnings"
                value="₹5,47,000"
                change={15.3}
                color="bg-gradient-to-r from-green-500 to-emerald-600"
              />
              <StatCard
                icon={Package}
                title="Products Sold"
                value="396"
                change={8.7}
                color="bg-gradient-to-r from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Avg. Price/kg"
                value="₹48"
                change={12.1}
                color="bg-gradient-to-r from-purple-500 to-pink-600"
              />
              <StatCard
                icon={Users}
                title="Active Buyers"
                value="23"
                change={5.2}
                color="bg-gradient-to-r from-orange-500 to-red-600"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SimpleLineChart
                data={analyticsData.monthlyEarnings || []}
                dataKey="earnings"
                nameKey="month"
                title="Monthly Earnings Trend"
              />
              
              <SimplePieChart
                data={analyticsData.productDistribution || []}
                title="Product Distribution"
              />
            </div>

            <SimpleBarChart
              data={analyticsData.buyerTypes || []}
              dataKey="value"
              nameKey="name"
              title="Buyer Types Distribution"
              color="bg-blue-500"
            />
          </div>
        )}

        {/* Consumer Analytics */}
        {userRole === 'consumer' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                title="Total Spent"
                value="₹28,650"
                change={-3.2}
                color="bg-gradient-to-r from-green-500 to-emerald-600"
              />
              <StatCard
                icon={Package}
                title="Orders Placed"
                value="152"
                change={12.8}
                color="bg-gradient-to-r from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Avg. Order Value"
                value="₹188"
                change={-8.5}
                color="bg-gradient-to-r from-purple-500 to-pink-600"
              />
              <StatCard
                icon={Calendar}
                title="Organic Purchases"
                value="127"
                suffix="/152"
                change={18.3}
                color="bg-gradient-to-r from-orange-500 to-red-600"
              />
            </div>

            {/* Charts */}
            <SimpleLineChart
              data={analyticsData.purchaseHistory || []}
              dataKey="amount"
              nameKey="month"
              title="Monthly Purchase Trends"
            />

            <SimpleBarChart
              data={analyticsData.preferences || []}
              dataKey="value"
              nameKey="category"
              title="Purchase Preferences"
              color="bg-emerald-500"
            />
          </div>
        )}

        {/* Admin Analytics */}
        {userRole === 'admin' && (
          <div className="space-y-8">
            {/* Platform Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value="1,998"
                change={23.5}
                color="bg-gradient-to-r from-green-500 to-emerald-600"
              />
              <StatCard
                icon={Package}
                title="Monthly Transactions"
                value="4,632"
                change={15.7}
                color="bg-gradient-to-r from-blue-500 to-cyan-600"
              />
              <StatCard
                icon={DollarSign}
                title="Platform Revenue"
                value="₹77,900"
                change={18.2}
                color="bg-gradient-to-r from-purple-500 to-pink-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Growth Rate"
                value="22.1"
                suffix="%"
                change={5.8}
                color="bg-gradient-to-r from-orange-500 to-red-600"
              />
            </div>

            {/* Platform Growth */}
            <SimpleLineChart
              data={analyticsData.platformMetrics || []}
              dataKey="users"
              nameKey="month"
              title="Platform Growth Metrics"
            />

            <SimpleBarChart
              data={analyticsData.userGrowth || []}
              dataKey="count"
              nameKey="type"
              title="User Growth by Type"
              color="bg-green-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;