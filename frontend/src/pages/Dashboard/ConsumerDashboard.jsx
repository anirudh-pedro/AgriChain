import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  User,
  Star,
  ShoppingCart,
  Package,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  Leaf,
  Award
} from 'lucide-react';

const ConsumerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [availableProduce, setAvailableProduce] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    crop: 'all',
    priceRange: 'all',
    location: 'all',
    quality: 'all'
  });
  const [selectedProduce, setSelectedProduce] = useState(null);

  // Mock data for available produce
  const mockProduce = [
    {
      id: 1,
      cropName: 'Organic Tomatoes',
      farmer: 'Rajesh Kumar',
      farmLocation: 'Village Kharar, Punjab',
      quantity: '500 kg',
      price: 50,
      unit: 'kg',
      harvestDate: '2025-09-20',
      quality: 'Premium',
      rating: 4.8,
      distance: '15 km',
      organic: true,
      journey: [
        { stage: 'Farm', date: '2025-09-20', location: 'Village Kharar, Punjab', status: 'completed' },
        { stage: 'Collection Center', date: '2025-09-21', location: 'Kharar Collection Center', status: 'completed' },
        { stage: 'Distributor', date: '2025-09-22', location: 'Green Fresh Distributors', status: 'current' },
        { stage: 'Retailer', date: '2025-09-23', location: 'Local Market', status: 'pending' }
      ]
    },
    {
      id: 2,
      cropName: 'Fresh Potatoes',
      farmer: 'Amit Singh',
      farmLocation: 'Village Mohali, Punjab',
      quantity: '1000 kg',
      price: 30,
      unit: 'kg',
      harvestDate: '2025-09-18',
      quality: 'Good',
      rating: 4.5,
      distance: '25 km',
      organic: false,
      journey: [
        { stage: 'Farm', date: '2025-09-18', location: 'Village Mohali, Punjab', status: 'completed' },
        { stage: 'Collection Center', date: '2025-09-19', location: 'Mohali Collection Center', status: 'completed' },
        { stage: 'Distributor', date: '2025-09-20', location: 'Fresh Foods Distributor', status: 'completed' },
        { stage: 'Retailer', date: '2025-09-21', location: 'City Market', status: 'current' }
      ]
    },
    {
      id: 3,
      cropName: 'Organic Carrots',
      farmer: 'Priya Sharma',
      farmLocation: 'Village Chandigarh, Punjab',
      quantity: '300 kg',
      price: 60,
      unit: 'kg',
      harvestDate: '2025-09-22',
      quality: 'Premium',
      rating: 4.9,
      distance: '8 km',
      organic: true,
      journey: [
        { stage: 'Farm', date: '2025-09-22', location: 'Village Chandigarh, Punjab', status: 'completed' },
        { stage: 'Collection Center', date: '2025-09-23', location: 'Chandigarh Collection Center', status: 'current' },
        { stage: 'Distributor', date: '2025-09-24', location: 'Organic Foods Distributor', status: 'pending' },
        { stage: 'Retailer', date: '2025-09-25', location: 'Organic Market', status: 'pending' }
      ]
    }
  ];

  // Mock purchase history
  const mockPurchases = [
    {
      id: 1,
      cropName: 'Organic Tomatoes',
      farmer: 'Rajesh Kumar',
      quantity: '5 kg',
      totalAmount: 250,
      purchaseDate: '2025-09-20',
      status: 'Delivered',
      rating: 5
    },
    {
      id: 2,
      cropName: 'Fresh Potatoes',
      farmer: 'Amit Singh',
      quantity: '10 kg',
      totalAmount: 300,
      purchaseDate: '2025-09-18',
      status: 'Delivered',
      rating: 4
    }
  ];

  useEffect(() => {
    setAvailableProduce(mockProduce);
    setPurchases(mockPurchases);
  }, []);

  const handlePurchase = (produce, quantity) => {
    const purchase = {
      id: Date.now(),
      cropName: produce.cropName,
      farmer: produce.farmer,
      quantity: `${quantity} kg`,
      totalAmount: produce.price * quantity,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Processing',
      rating: null
    };
    setPurchases([purchase, ...purchases]);
  };

  const filteredProduce = availableProduce.filter(produce => {
    const matchesSearch = produce.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produce.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produce.farmLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCrop = filters.crop === 'all' || produce.cropName.toLowerCase().includes(filters.crop.toLowerCase());
    const matchesPrice = filters.priceRange === 'all' || 
                        (filters.priceRange === 'low' && produce.price <= 40) ||
                        (filters.priceRange === 'medium' && produce.price > 40 && produce.price <= 60) ||
                        (filters.priceRange === 'high' && produce.price > 60);
    const matchesQuality = filters.quality === 'all' || 
                          (filters.quality === 'organic' && produce.organic) ||
                          (filters.quality === 'premium' && produce.quality === 'Premium');
    
    return matchesSearch && matchesCrop && matchesPrice && matchesQuality;
  });

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
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

  const TraceOriginModal = ({ produce, onClose }) => {
    if (!produce) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Trace Origin: {produce.cropName}</h3>
            <button
              onClick={onClose}
              className="text-purple-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {produce.journey.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'current' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle size={16} className="text-white" /> :
                     step.status === 'current' ? <Clock size={16} className="text-white" /> :
                     <Package size={16} className="text-white" />}
                  </div>
                  {index < produce.journey.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${
                      step.status === 'completed' ? 'text-green-400' :
                      step.status === 'current' ? 'text-blue-400' : 'text-purple-200'
                    }`}>
                      {step.stage}
                    </h4>
                    <span className="text-purple-200 text-sm">
                      {new Date(step.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm">{step.location}</p>
                  {step.status === 'current' && (
                    <p className="text-blue-400 text-xs mt-1">Currently at this stage</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10">
            <h4 className="text-white font-medium mb-2">Blockchain Verification</h4>
            <p className="text-purple-200 text-sm">
              This journey is verified and secured by blockchain technology. 
              Each step is recorded immutably to ensure authenticity and traceability.
            </p>
            <div className="mt-2 text-xs text-green-400">
              ✓ Blockchain Hash: 0x1a2b3c4d5e6f7g8h9i0j...
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Available Products"
          value={availableProduce.length}
          color="bg-gradient-to-r from-green-500 to-emerald-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Purchases"
          value={purchases.length}
          color="bg-gradient-to-r from-blue-500 to-cyan-600"
        />
        <StatCard
          icon={TrendingUp}
          title="This Month Spent"
          value="₹2,450"
          change={-15.2}
          color="bg-gradient-to-r from-purple-500 to-pink-600"
        />
        <StatCard
          icon={Star}
          title="Avg Rating Given"
          value="4.8"
          color="bg-gradient-to-r from-orange-500 to-red-600"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'search-produce', label: 'Search Produce', icon: Search },
            { id: 'trace-origin', label: 'Trace Origin', icon: MapPin },
            { id: 'purchase-history', label: 'Purchase History', icon: ShoppingCart }
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
            {/* Featured Products */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Featured Products</h3>
              <div className="space-y-4">
                {availableProduce.slice(0, 3).map(produce => (
                  <div key={produce.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Package size={20} className="text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{produce.cropName}</h4>
                        <p className="text-purple-200 text-sm">{produce.farmer} • ₹{produce.price}/{produce.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {produce.organic && <Leaf size={16} className="text-green-400" />}
                      {produce.quality === 'Premium' && <Award size={16} className="text-yellow-400" />}
                      <span className="text-yellow-400 text-sm">⭐ {produce.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Purchases */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Purchases</h3>
              <div className="space-y-4">
                {purchases.slice(0, 3).map(purchase => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <ShoppingCart size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{purchase.cropName}</h4>
                        <p className="text-purple-200 text-sm">{purchase.quantity} • ₹{purchase.totalAmount}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      purchase.status === 'Delivered' 
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                    }`}>
                      {purchase.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'search-produce' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                  placeholder="Search by crop name, farmer, or location..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.crop}
                  onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                >
                  <option value="all">All Crops</option>
                  <option value="tomatoes">Tomatoes</option>
                  <option value="potatoes">Potatoes</option>
                  <option value="carrots">Carrots</option>
                </select>
                
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                >
                  <option value="all">All Prices</option>
                  <option value="low">₹0 - ₹40</option>
                  <option value="medium">₹41 - ₹60</option>
                  <option value="high">₹61+</option>
                </select>
                
                <select
                  value={filters.quality}
                  onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                >
                  <option value="all">All Quality</option>
                  <option value="organic">Organic Only</option>
                  <option value="premium">Premium Only</option>
                </select>
                
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                >
                  <option value="all">All Locations</option>
                  <option value="nearby">Nearby (≤20km)</option>
                  <option value="punjab">Punjab</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProduce.map(produce => (
              <div key={produce.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="aspect-w-16 aspect-h-12 mb-4">
                  <div className="w-full h-32 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Package size={40} className="text-green-400" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{produce.cropName}</h3>
                    <div className="flex items-center space-x-1">
                      {produce.organic && <Leaf size={16} className="text-green-400" />}
                      {produce.quality === 'Premium' && <Award size={16} className="text-yellow-400" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-200 text-sm">
                    <User size={16} />
                    <span>{produce.farmer}</span>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400" />
                      <span>{produce.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-200 text-sm">
                    <MapPin size={16} />
                    <span>{produce.farmLocation}</span>
                    <span className="text-green-400">({produce.distance})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-200 text-sm">
                    <Calendar size={16} />
                    <span>Harvested: {new Date(produce.harvestDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-2xl font-bold text-white">₹{produce.price}/{produce.unit}</p>
                      <p className="text-purple-200 text-sm">{produce.quantity} available</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProduce(produce)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handlePurchase(produce, 1)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trace-origin' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Trace Product Origin</h3>
            <p className="text-purple-200 mb-6">
              Click on any product to view its complete journey from farm to your table, 
              secured by blockchain technology.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProduce.map(produce => (
                <div 
                  key={produce.id} 
                  className="p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  onClick={() => setSelectedProduce(produce)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{produce.cropName}</h4>
                    <Eye size={20} className="text-blue-400" />
                  </div>
                  <p className="text-purple-200 text-sm mb-2">from {produce.farmer}</p>
                  <p className="text-purple-200 text-sm">{produce.farmLocation}</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-green-400 text-xs">✓ Blockchain Verified</span>
                    {produce.organic && <Leaf size={16} className="text-green-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'purchase-history' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Purchase History</h3>
            
            <div className="space-y-4">
              {purchases.map(purchase => (
                <div key={purchase.id} className="p-4 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <ShoppingCart size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{purchase.cropName}</h4>
                        <p className="text-purple-200 text-sm">from {purchase.farmer}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      purchase.status === 'Delivered' 
                        ? 'bg-green-500/20 text-green-400 border-green-400/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-400/30'
                    }`}>
                      {purchase.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-purple-200 text-sm">Quantity</p>
                      <p className="text-white font-medium">{purchase.quantity}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Total Amount</p>
                      <p className="text-white font-medium">₹{purchase.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Purchase Date</p>
                      <p className="text-white font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Rating Given</p>
                      <div className="flex items-center space-x-1">
                        {purchase.rating ? (
                          <>
                            <span className="text-white font-medium">{purchase.rating}</span>
                            <Star size={16} className="text-yellow-400" />
                          </>
                        ) : (
                          <span className="text-purple-200">Not rated</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trace Origin Modal */}
      {selectedProduce && (
        <TraceOriginModal 
          produce={selectedProduce} 
          onClose={() => setSelectedProduce(null)} 
        />
      )}
    </div>
  );
};

export default ConsumerDashboard;