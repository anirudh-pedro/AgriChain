import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_PRODUCE_TRACE } from '../../utils/queries';
import { ShoppingCart, Package, QrCode, Star, MapPin, Calendar, Leaf, Award, Info, Search } from 'lucide-react';

const ConsumerDashboard = ({ currentUser, onScanQR, onSearchProduce, onViewTrace }) => {
  const [searchId, setSearchId] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'PROD-001-2024',
    'PROD-045-2024',
    'PROD-123-2024'
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      onSearchProduce && onSearchProduce(searchId);
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchId)) {
        setRecentSearches(prev => [searchId, ...prev.slice(0, 4)]);
      }
      setSearchId('');
    }
  };

  // Mock featured products data
  const featuredProducts = [
    {
      id: 'PROD-001-2024',
      name: 'Organic Roma Tomatoes',
      farm: 'Green Valley Organic Farm',
      location: 'California, USA',
      harvestDate: '2024-01-10',
      quality: 'A+',
      certifications: ['Organic', 'Non-GMO'],
      price: '$4.99/lb',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      description: 'Fresh, vine-ripened organic tomatoes perfect for cooking and salads.'
    },
    {
      id: 'PROD-045-2024',
      name: 'Fresh Baby Lettuce',
      farm: 'Sunny Acres Hydroponic',
      location: 'Oregon, USA',
      harvestDate: '2024-01-12',
      quality: 'A',
      certifications: ['Hydroponic', 'Pesticide-Free'],
      price: '$3.49/bunch',
      image: '/api/placeholder/300/200',
      rating: 4.6,
      description: 'Crisp, tender baby lettuce grown in controlled hydroponic environment.'
    },
    {
      id: 'PROD-123-2024',
      name: 'Rainbow Bell Peppers',
      farm: 'Heritage Vegetable Co.',
      location: 'Texas, USA',
      harvestDate: '2024-01-08',
      quality: 'A',
      certifications: ['Sustainable', 'Local'],
      price: '$2.99/lb',
      image: '/api/placeholder/300/200',
      rating: 4.7,
      description: 'Colorful mix of bell peppers, locally grown with sustainable practices.'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getQualityColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-600 text-white';
      case 'A': return 'bg-green-500 text-white';
      case 'B': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ShoppingCart className="h-8 w-8 mr-3 text-purple-600" />
          Consumer Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name || 'Consumer'}! Discover fresh, traceable produce.</p>
      </div>

      {/* Search & Scan Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Track Your Produce</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search by ID */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-600" />
              Search by Product ID
            </h3>
            <form onSubmit={handleSearch} className="flex space-x-3 mb-4">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter product ID (e.g., PROD-001-2024)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!searchId.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Track
              </button>
            </form>
            
            {recentSearches.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((id, index) => (
                    <button
                      key={index}
                      onClick={() => onViewTrace && onViewTrace(id)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR Code Scanner */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-green-600" />
              Scan QR Code
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">Scan the QR code on your produce package</p>
              <button
                onClick={onScanQR}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Open Camera Scanner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Fresh Produce */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Leaf className="h-6 w-6 mr-2 text-green-600" />
            Featured Fresh Produce
          </h2>
          <button className="text-purple-600 hover:text-purple-800 font-medium">
            View All Products
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Product Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>

              <div className="p-6">
                {/* Product Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-purple-600 font-medium text-lg">{product.price}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getQualityColor(product.quality)}`}>
                    {product.quality}
                  </span>
                </div>

                {/* Farm Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{product.farm}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Harvested {formatDate(product.harvestDate)}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center space-x-1 mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                {/* Certifications */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewTrace && onViewTrace(product.id)}
                    className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Info className="h-4 w-4" />
                    <span>View Journey</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Traceability Benefits */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Leaf className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-900">Farm to Table Transparency</h3>
          </div>
          <p className="text-green-800 text-sm mb-4">
            Every product comes with complete traceability information, from farm location to harvest date, 
            ensuring you know exactly where your food comes from.
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Farm location and practices</li>
            <li>• Harvest and processing dates</li>
            <li>• Quality certifications</li>
            <li>• Transportation history</li>
          </ul>
        </div>

        {/* Quality Assurance */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">Quality Guaranteed</h3>
          </div>
          <p className="text-blue-800 text-sm mb-4">
            All produce undergoes rigorous quality inspections at multiple points in the supply chain, 
            ensuring only the freshest products reach your table.
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Multi-point quality checks</li>
            <li>• Freshness monitoring</li>
            <li>• Temperature control tracking</li>
            <li>• Expiration date management</li>
          </ul>
        </div>

        {/* Support Local Farmers */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">Support Local Farmers</h3>
          </div>
          <p className="text-purple-800 text-sm mb-4">
            By choosing traceable produce, you're directly supporting local farmers and sustainable 
            farming practices in your community.
          </p>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Direct farmer support</li>
            <li>• Sustainable practices</li>
            <li>• Reduced food miles</li>
            <li>• Community impact</li>
          </ul>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">How Product Traceability Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">1. Farm Registration</h3>
            <p className="text-sm text-gray-600">Farmers register their produce on the blockchain with detailed information.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">2. Quality Tracking</h3>
            <p className="text-sm text-gray-600">Quality inspections and handling records are added throughout the journey.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCode className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">3. QR Code Generation</h3>
            <p className="text-sm text-gray-600">Each product gets a unique QR code linking to its complete history.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">4. Consumer Access</h3>
            <p className="text-sm text-gray-600">You scan the code or search by ID to view the complete journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;