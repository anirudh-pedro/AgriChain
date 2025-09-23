import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Package, Users, Eye, MapPin, Calendar, Star, Filter, Search } from 'lucide-react';
import { StatsCard } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

// GraphQL queries
const QUERY_ALL_BLOCKCHAIN_DATA = `
  query AllBlockchainData {
    allBlockchainData {
      Key
      Record {
        id
        type
        timestamp
        verified
        farmerId
        cropType
        quantity
        unit
        location
        quality
        customData
      }
    }
  }
`;

const CREATE_BLOCKCHAIN_DATA = `
  mutation CreateBlockchainData($input: BlockchainDataInput!) {
    createBlockchainData(input: $input) {
      id
      success
      blockchainTxId
      message
      data {
        id
        type
        timestamp
        verified
      }
    }
  }
`;

// API call function
const makeGraphQLRequest = async (query, variables = {}) => {
  try {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

const DistributorDashboard = () => {
  const [availableProduce, setAvailableProduce] = useState([]);
  const [filteredProduce, setFilteredProduce] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch produce from blockchain and local marketplace
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from blockchain...');
        
        // Get blockchain data
        const blockchainData = await makeGraphQLRequest(QUERY_ALL_BLOCKCHAIN_DATA);
        console.log('Raw blockchain response:', blockchainData);
        
        // Get local marketplace products (farmer registrations)
        const marketplaceProduce = JSON.parse(localStorage.getItem('marketplace_produce') || '[]');
        console.log('Marketplace products from localStorage:', marketplaceProduce);
        
        // Convert blockchain data to product format
        const blockchainProducts = blockchainData.allBlockchainData
          .filter(item => {
            try {
              const record = item.Record;
              return record.type === 'harvest';
            } catch {
              return false;
            }
          })
          .map(item => {
            try {
              const record = item.Record;
              const customData = JSON.parse(record.customData || '{}');
              
              return {
                id: record.id,
                cropName: record.cropType || customData.cropType || 'Unknown Crop',
                variety: customData.variety || 'Standard',
                quantity: parseInt(record.quantity || customData.quantity) || 0,
                unit: record.unit || customData.unit || 'kg',
                pricePerUnit: parseFloat(customData.pricePerUnit) || 0,
                farmerName: customData.farmerName || 'Unknown Farmer',
                farmLocation: customData.farmLocation || record.location || 'Unknown Location',
                harvestDate: customData.harvestDate || record.timestamp.split('T')[0],
                quality: record.quality || customData.quality || 'Grade A',
                organicCertified: customData.organicCertified || false,
                description: customData.description || 'Fresh produce from verified farmer',
                blockchainId: record.id,
                blockchainTimestamp: record.timestamp,
                verified: record.verified,
                isFromBlockchain: true
              };
            } catch (error) {
              console.error('Error parsing blockchain record:', error);
              return null;
            }
          })
          .filter(product => product !== null);
        
        console.log('Converted blockchain products:', blockchainProducts);
        console.log('Number of blockchain products:', blockchainProducts.length);
        
        // Default mock products ONLY if no blockchain products exist
        const defaultMockProduce = blockchainProducts.length === 0 ? [
          {
            id: 'PROD_001',
            cropName: 'Premium Basmati Rice',
            variety: 'Basmati 1121',
            quantity: 500,
            unit: 'kg',
            pricePerUnit: 45,
            farmerName: 'Rajesh Kumar',
            farmLocation: 'Punjab, India',
            harvestDate: '2025-09-15',
            quality: 'Grade A+',
            organicCertified: true,
            description: 'Premium quality basmati rice, freshly harvested',
            blockchainId: 'BLOCKCHAIN_001',
            isFromBlockchain: false
          },
          {
            id: 'PROD_002',
            cropName: 'Organic Wheat',
            variety: 'HD-2967',
            quantity: 1000,
            unit: 'kg',
            pricePerUnit: 25,
            farmerName: 'Priya Sharma',
            farmLocation: 'Haryana, India',
            harvestDate: '2025-09-10',
            quality: 'Grade A',
            organicCertified: true,
            description: 'Organic wheat grown without pesticides',
            blockchainId: 'BLOCKCHAIN_002',
            isFromBlockchain: false
          }
        ] : [];

        // Combine products: prioritize blockchain data, then marketplace, fallback to mock
        const allProduce = [...blockchainProducts, ...marketplaceProduce, ...defaultMockProduce];
        
        console.log('Data sources used:');
        console.log('- Blockchain products:', blockchainProducts.length);
        console.log('- Marketplace products:', marketplaceProduce.length); 
        console.log('- Mock products:', defaultMockProduce.length);
        console.log('- Total products:', allProduce.length);
        
        // Remove duplicates based on blockchain ID
        const uniqueProduce = allProduce.filter((product, index, arr) => 
          arr.findIndex(p => p.blockchainId === product.blockchainId) === index
        );
        
        console.log('Final products:', uniqueProduce);
        setAvailableProduce(uniqueProduce);
        setFilteredProduce(uniqueProduce);
        
      } catch (error) {
        console.error('Failed to fetch blockchain data:', error);
        
        // Fallback to local data only
        const marketplaceProduce = JSON.parse(localStorage.getItem('marketplace_produce') || '[]');
        const defaultProduce = [
          {
            id: 'PROD_001',
            cropName: 'Premium Basmati Rice (Demo)',
            variety: 'Basmati 1121',
            quantity: 500,
            unit: 'kg',
            pricePerUnit: 45,
            farmerName: 'Rajesh Kumar',
            farmLocation: 'Punjab, India',
            harvestDate: '2025-09-15',
            quality: 'Grade A+',
            organicCertified: true,
            description: 'Premium quality basmati rice (Demo - Backend Offline)',
            blockchainId: 'DEMO_001'
          }
        ];
        
        const fallbackProduce = [...marketplaceProduce, ...defaultProduce];
        setAvailableProduce(fallbackProduce);
        setFilteredProduce(fallbackProduce);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter produce based on search and category
  useEffect(() => {
    let filtered = availableProduce;

    if (searchTerm) {
      filtered = filtered.filter(produce => 
        produce.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produce.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produce.farmLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(produce => 
        produce.cropName.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProduce(filtered);
  }, [searchTerm, selectedCategory, availableProduce]);

  const handlePurchase = async (product) => {
    try {
      const purchaseId = `PURCHASE_${Date.now()}`;
      
      // Create blockchain transaction for distributor purchase
      const blockchainInput = {
        type: 'distribution',
        farmerId: product.farmerId || 'FARMER_001',
        distributorId: 'DIST_001',
        sourceDataId: product.blockchainId,
        quantity: product.quantity.toString(),
        unit: product.unit,
        pricePerUnit: product.pricePerUnit.toString(),
        totalAmount: (product.quantity * product.pricePerUnit).toString(),
        location: 'Distribution Center, Mumbai',
        customData: JSON.stringify({
          purchaseId: purchaseId,
          productId: product.id,
          cropName: product.cropName,
          farmerName: product.farmerName,
          farmLocation: product.farmLocation,
          purchaseDate: new Date().toISOString(),
          distributorName: 'Current Distributor',
          status: 'purchased'
        })
      };

      console.log('Recording purchase on blockchain:', blockchainInput);

      // Submit to blockchain
      const blockchainResult = await makeGraphQLRequest(CREATE_BLOCKCHAIN_DATA, {
        input: blockchainInput
      });

      if (blockchainResult.createBlockchainData.success) {
        const blockchainData = blockchainResult.createBlockchainData;
        
        // Store purchase locally as well
        const purchaseData = {
          purchaseId: purchaseId,
          productId: product.id,
          blockchainId: product.blockchainId,
          distributorId: 'DIST_001',
          farmerId: product.farmerId || 'FARMER_001',
          cropName: product.cropName,
          quantity: product.quantity,
          pricePerUnit: product.pricePerUnit,
          totalAmount: product.quantity * product.pricePerUnit,
          purchaseDate: new Date().toISOString(),
          blockchainTxId: blockchainData.blockchainTxId || blockchainData.id,
          distributionBlockchainId: blockchainData.id,
          status: 'purchased'
        };

        const existingPurchases = JSON.parse(localStorage.getItem('distributor_purchases') || '[]');
        localStorage.setItem('distributor_purchases', JSON.stringify([...existingPurchases, purchaseData]));

        // Remove from marketplace (product is now purchased)
        const marketplace = JSON.parse(localStorage.getItem('marketplace_produce') || '[]');
        const updatedMarketplace = marketplace.filter(p => p.id !== product.id);
        localStorage.setItem('marketplace_produce', JSON.stringify(updatedMarketplace));

        // Update local state
        setAvailableProduce(prev => prev.filter(p => p.id !== product.id));
        setFilteredProduce(prev => prev.filter(p => p.id !== product.id));

        alert(`🎉 Purchase Successful!\n\n📦 Product: ${product.cropName}\n👨‍🌾 Farmer: ${product.farmerName}\n💰 Total: ₹${purchaseData.totalAmount}\n🔗 Blockchain TX: ${blockchainData.id}\n📋 Original Product ID: ${product.blockchainId}\n\n✅ Transaction recorded on blockchain\n📋 Supply chain updated automatically\n🚚 Ready for distribution to retailers`);
        
      } else {
        throw new Error(blockchainData.message);
      }

    } catch (error) {
      console.error('Purchase failed:', error);
      alert(`❌ Purchase Failed!\n\nError: ${error.message}\n\n💡 Please check:\n1. Backend server is running\n2. Blockchain network is active\n3. Product is still available`);
    }
  };

  const categories = ['all', 'rice', 'wheat', 'tomatoes', 'vegetables', 'grains'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
          <p className="text-gray-600 mt-1">Source quality produce from farmers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Spent"
          value="₹5,000"
          icon={<DollarSign className="w-8 h-8" />}
          trend="+15%"
          color="green"
        />
        <StatsCard
          title="Total Purchases"
          value="1"
          icon={<ShoppingCart className="w-8 h-8" />}
          trend="+12%"
          color="blue"
        />
        <StatsCard
          title="Active Farmers"
          value="3"
          icon={<Users className="w-8 h-8" />}
          color="yellow"
        />
        <StatsCard
          title="Monthly Volume"
          value="1,700 kg"
          icon={<Package className="w-8 h-8" />}
          color="purple"
        />
      </div>

      {/* Marketplace Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Available Produce from Farmers</h2>
            
            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search produce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading available produce...</div>
            </div>
          ) : filteredProduce.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProduce.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-green-600" />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.cropName}</h3>
                      <div className="flex gap-1">
                        {product.organicCertified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Organic
                          </span>
                        )}
                        {product.isFromBlockchain && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            🔗 Blockchain
                          </span>
                        )}
                        {product.verified && (
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                            ✅ Verified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{product.variety}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{product.farmerName}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{product.farmLocation}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        <span>Quality: {product.quality}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-green-600">₹{product.pricePerUnit}</span>
                          <span className="text-sm text-gray-500">/{product.unit}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Available</div>
                          <div className="font-semibold">{product.quantity} {product.unit}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePurchase(product)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Purchase
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`Viewing blockchain details for ${product.blockchainId}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;