import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  Store, 
  User, 
  MapPin, 
  Calendar, 
  Hash, 
  CheckCircle, 
  ArrowRight,
  QrCode,
  AlertCircle,
  Clock,
  Leaf,
  Camera,
  X
} from 'lucide-react';
import QRScanner from '../../components/UI/QRScanner';

const TraceabilityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [traceData, setTraceData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([
    'AGR-2025-001',
    'TOM-ORGANIC-042',
    'POT-FRESH-789'
  ]);

  // Mock trace data
  const mockTraceData = {
    productId: 'AGR-2025-001',
    productName: 'Organic Tomatoes',
    batchId: 'BATCH-2025-0922-001',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    currentStatus: 'Delivered',
    totalQuantity: '500 kg',
    currentLocation: 'Fresh Foods Mart, Mumbai',
    journey: [
      {
        id: 1,
        stage: 'Farming',
        title: 'Grown by Farmer',
        actor: 'Rajesh Kumar',
        location: 'Farm Block A, Village Kharar, Punjab',
        date: '2025-09-10',
        time: '06:00 AM',
        description: 'Organic tomatoes planted and grown using sustainable farming practices',
        blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
        status: 'completed',
        details: {
          farmingMethod: 'Organic',
          seedVariety: 'Roma Tomatoes',
          waterSource: 'Rainwater Harvesting',
          pesticides: 'None - Natural pest control'
        }
      },
      {
        id: 2,
        stage: 'Harvesting',
        title: 'Harvested',
        actor: 'Rajesh Kumar',
        location: 'Farm Block A, Village Kharar, Punjab',
        date: '2025-09-20',
        time: '05:30 AM',
        description: 'Fresh tomatoes harvested at optimal ripeness',
        blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
        status: 'completed',
        details: {
          harvestWeight: '500 kg',
          qualityGrade: 'Premium A+',
          harvestConditions: 'Cool morning, optimal humidity',
          packagingDate: '2025-09-20'
        }
      },
      {
        id: 3,
        stage: 'Distribution',
        title: 'Picked up by Distributor',
        actor: 'Green Vegetables Distributor',
        location: 'Distribution Center, Chandigarh',
        date: '2025-09-20',
        time: '02:00 PM',
        description: 'Produce collected and transported in temperature-controlled vehicle',
        blockchainHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
        status: 'completed',
        details: {
          transportVehicle: 'Refrigerated Truck - RJ14-AB-1234',
          temperature: '4°C maintained',
          transitTime: '6 hours',
          qualityCheck: 'Passed - No damage'
        }
      },
      {
        id: 4,
        stage: 'Retail',
        title: 'Received by Retailer',
        actor: 'Fresh Foods Mart',
        location: 'Fresh Foods Mart, Mumbai',
        date: '2025-09-21',
        time: '08:00 AM',
        description: 'Produce received and stocked for sale',
        blockchainHash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
        status: 'completed',
        details: {
          receivedQuantity: '500 kg',
          qualityInspection: 'Excellent condition',
          shelfLife: '5-7 days',
          pricePerKg: '₹65'
        }
      },
      {
        id: 5,
        stage: 'Consumer',
        title: 'Sold to Consumer',
        actor: 'Priya Sharma',
        location: 'Mumbai, Maharashtra',
        date: '2025-09-22',
        time: '11:30 AM',
        description: 'Purchased by end consumer',
        blockchainHash: '0x5e6f7890abcdef1234567890abcdef1234567890',
        status: 'completed',
        details: {
          purchaseQuantity: '2 kg',
          purchaseAmount: '₹130',
          paymentMethod: 'Digital Payment',
          customerSatisfaction: 'Excellent quality!'
        }
      }
    ]
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (query === 'AGR-2025-001' || query === 'TOM-ORGANIC-042') {
        setTraceData(mockTraceData);
        // Add to search history if not already present
        if (!searchHistory.includes(query)) {
          setSearchHistory([query, ...searchHistory.slice(0, 4)]);
        }
      } else {
        setTraceData(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleQRScan = (scannedData) => {
    setSearchQuery(scannedData);
    setShowQRScanner(false);
    handleSearch(scannedData);
  };

  const handleQRError = (error) => {
    console.error('QR Scan Error:', error);
    alert('Error scanning QR code. Please try again or enter the ID manually.');
    setShowQRScanner(false);
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'Farming': return <Leaf className="text-green-600" size={24} />;
      case 'Harvesting': return <Package className="text-blue-600" size={24} />;
      case 'Distribution': return <Truck className="text-orange-600" size={24} />;
      case 'Retail': return <Store className="text-purple-600" size={24} />;
      case 'Consumer': return <User className="text-teal-600" size={24} />;
      default: return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-300';
      case 'in-progress': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'pending': return 'text-orange-600 bg-orange-100 border-orange-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">Produce Traceability</h1>
          <p className="text-emerald-600 text-lg">Track your produce from farm to table with blockchain transparency</p>
        </div>

        {/* Search Section */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white/40 rounded-xl text-emerald-800 placeholder-emerald-500 focus:outline-none focus:border-emerald-400 focus:bg-white/80 transition-all text-lg"
                placeholder="Enter Product ID, Batch ID, or scan QR code..."
              />
            </div>
            <button
              onClick={() => setShowQRScanner(true)}
              className="bg-blue-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Camera size={20} />
              <span>Scan QR</span>
            </button>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Tracing...</span>
                </div>
              ) : (
                'Trace Product'
              )}
            </button>
            <button className="bg-white/60 p-4 rounded-xl border border-white/40 hover:bg-white/80 transition-all">
              <QrCode className="text-emerald-600" size={20} />
            </button>
          </div>

          {/* Search History */}
          <div className="flex flex-wrap gap-2">
            <span className="text-emerald-700 text-sm font-medium">Recent searches:</span>
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(item);
                  handleSearch(item);
                }}
                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 border border-white/30 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-emerald-700 font-medium">Searching blockchain records...</p>
          </div>
        )}

        {/* Trace Results */}
        {!isLoading && searchQuery && !traceData && (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 border border-white/30 text-center">
            <AlertCircle className="mx-auto mb-4 text-orange-500" size={48} />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Product Not Found</h3>
            <p className="text-emerald-600">No traceability data found for "{searchQuery}". Please check the Product ID or QR code.</p>
          </div>
        )}

        {/* Traceability Results */}
        {traceData && (
          <div className="space-y-8">
            {/* Product Overview */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-emerald-800 mb-4">{traceData.productName}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Product ID</p>
                      <p className="text-emerald-800 font-semibold">{traceData.productId}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Batch ID</p>
                      <p className="text-emerald-800 font-semibold">{traceData.batchId}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Total Quantity</p>
                      <p className="text-emerald-800 font-semibold">{traceData.totalQuantity}</p>
                    </div>
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Current Status</p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-sm font-medium">
                        {traceData.currentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-emerald-600 text-sm font-medium">Current Location</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="text-emerald-500" size={16} />
                      <p className="text-emerald-800 font-semibold">{traceData.currentLocation}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-emerald-200">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      <QrCode className="text-gray-500" size={64} />
                    </div>
                    <p className="text-center text-emerald-700 text-sm font-medium">QR Code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Chain Journey */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <h3 className="text-xl font-bold text-emerald-800 mb-6">Supply Chain Journey</h3>
              
              <div className="relative">
                {/* Journey Timeline */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-200"></div>
                
                <div className="space-y-8">
                  {traceData.journey.map((step, index) => (
                    <div key={step.id} className="relative flex items-start space-x-6">
                      {/* Stage Icon */}
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-emerald-200 shadow-lg">
                        {getStageIcon(step.stage)}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 bg-white/40 rounded-xl p-6 border border-white/30">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-emerald-800">{step.title}</h4>
                            <p className="text-emerald-600">{step.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                            <CheckCircle size={12} className="inline mr-1" />
                            Completed
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-emerald-600 text-sm font-medium">Actor</p>
                            <p className="text-emerald-800 font-semibold">{step.actor}</p>
                          </div>
                          <div>
                            <p className="text-emerald-600 text-sm font-medium">Location</p>
                            <p className="text-emerald-800">{step.location}</p>
                          </div>
                          <div>
                            <p className="text-emerald-600 text-sm font-medium">Date</p>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} className="text-emerald-500" />
                              <p className="text-emerald-800">{step.date}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-emerald-600 text-sm font-medium">Time</p>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} className="text-emerald-500" />
                              <p className="text-emerald-800">{step.time}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Step Details */}
                        <div className="bg-white/60 rounded-lg p-4 mb-4">
                          <p className="text-emerald-700 font-medium mb-2">Details:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(step.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-emerald-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-emerald-800 text-sm font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Blockchain Hash */}
                        <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <Hash className="text-emerald-600" size={16} />
                          <div>
                            <p className="text-emerald-700 text-xs font-medium">Blockchain Transaction Hash:</p>
                            <p className="text-emerald-800 text-sm font-mono break-all">{step.blockchainHash}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow to next step */}
                      {index < traceData.journey.length - 1 && (
                        <div className="absolute left-8 top-20 transform translate-x-1 z-0">
                          <ArrowRight className="text-emerald-400" size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">Blockchain Verification</h3>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <h4 className="text-emerald-800 font-semibold">Verified Supply Chain</h4>
                </div>
                <p className="text-emerald-700 mb-3">
                  This produce has been verified through our blockchain network. All transactions and transfers 
                  have been cryptographically secured and are immutable.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    ✓ Organic Certified
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    ✓ Quality Verified
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    ✓ Temperature Controlled
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    ✓ Traceable Origin
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <QRScanner
              onScanSuccess={handleQRScan}
              onScanError={handleQRError}
            />
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Position the QR code within the camera frame to scan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceabilityPage;