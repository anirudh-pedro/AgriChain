import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Search,
  Filter,
  Plus,
  Truck
} from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card, { StatsCard } from '../../components/UI/Card';
import { BarChart } from '../../components/UI/Charts';

const RetailerDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    inventoryValue: 0,
    activeProducts: 0
  });

  // Mock inventory data
  const mockInventory = [
    {
      id: 1,
      productName: 'Organic Tomatoes',
      category: 'Vegetables',
      quantity: 50,
      unit: 'kg',
      buyPrice: 45,
      sellPrice: 65,
      supplier: 'Green Valley Distributors',
      expiryDate: '2025-09-30',
      status: 'in-stock'
    },
    {
      id: 2,
      productName: 'Fresh Potatoes',
      category: 'Vegetables', 
      quantity: 100,
      unit: 'kg',
      buyPrice: 25,
      sellPrice: 35,
      supplier: 'Farm Fresh Distributors',
      expiryDate: '2025-10-15',
      status: 'in-stock'
    },
    {
      id: 3,
      productName: 'Red Apples',
      category: 'Fruits',
      quantity: 5,
      unit: 'kg',
      buyPrice: 80,
      sellPrice: 120,
      supplier: 'Mountain Fresh Distributors',
      expiryDate: '2025-09-25',
      status: 'low-stock'
    }
  ];

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD001',
      customerName: 'Raj Patel',
      items: [
        { product: 'Organic Tomatoes', quantity: 2, price: 65 },
        { product: 'Fresh Potatoes', quantity: 5, price: 35 }
      ],
      totalAmount: 305,
      status: 'delivered',
      orderDate: '2025-09-21'
    }
  ];

  const salesData = [
    { name: 'Jan', value: 25000 },
    { name: 'Feb', value: 28000 },
    { name: 'Mar', value: 32000 },
    { name: 'Apr', value: 29000 },
    { name: 'May', value: 35000 },
    { name: 'Jun', value: 38000 }
  ];

  useEffect(() => {
    setInventory(mockInventory);
    setOrders(mockOrders);
    calculateStats();
  }, []);

  const calculateStats = () => {
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = mockOrders.length;
    const inventoryValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.buyPrice), 0);
    const activeProducts = mockInventory.filter(item => item.status === 'in-stock').length;
    
    setStats({ totalRevenue, totalOrders, inventoryValue, activeProducts });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Retailer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage inventory and serve customers</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-8 h-8" />}
          trend="+18%"
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-8 h-8" />}
          trend="+25%"
          color="blue"
        />
        <StatsCard
          title="Inventory Value"
          value={`₹${stats.inventoryValue.toLocaleString()}`}
          icon={<Package className="w-8 h-8" />}
          color="yellow"
        />
        <StatsCard
          title="Active Products"
          value={stats.activeProducts}
          icon={<TrendingUp className="w-8 h-8" />}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'inventory', label: 'Inventory', icon: <Package className="w-5 h-5" /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>
          </Card>

          {/* Inventory Table */}
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.supplier}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.buyPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.sellPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(((item.sellPrice - item.buyPrice) / item.buyPrice) * 100)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="secondary" size="sm" icon={<Eye className="w-4 h-4" />}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h3>
            <div className="h-64">
              <BarChart
                data={salesData}
                color="#3b82f6"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                {[
                  { name: 'Organic Tomatoes', sales: 150, revenue: 9750 },
                  { name: 'Fresh Potatoes', sales: 200, revenue: 7000 },
                  { name: 'Red Apples', sales: 80, revenue: 9600 }
                ].map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{product.sales} {product.sales > 100 ? 'kg' : 'units'} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
              <div className="space-y-3">
                {mockInventory.filter(item => item.status === 'low-stock').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800">{item.productName}</p>
                      <p className="text-sm text-yellow-600">Only {item.quantity} {item.unit} left</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Reorder
                    </Button>
                  </div>
                ))}
                
                {mockInventory.filter(item => new Date(item.expiryDate) <= new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)).map((item) => (
                  <div key={`exp-${item.id}`} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">{item.productName}</p>
                      <p className="text-sm text-red-600">Expires on {new Date(item.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <Button variant="danger" size="sm">
                      Mark Down
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;