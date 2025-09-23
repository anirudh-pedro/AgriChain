// src/pages/dashboard/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Package, TrendingUp, Calendar } from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card, { StatsCard } from '../../components/UI/Card';
import LocationPicker from '../../components/UI/LocationPicker';
import { LineChart } from '../../components/UI/Charts';

// GraphQL mutations and queries
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

const QUERY_ALL_BLOCKCHAIN_DATA = `
  query AllBlockchainData {
    allBlockchainData {
      Key
      Record {
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

const FarmerDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduce, setEditingProduce] = useState(null);
  const [produceList, setProduceList] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalProduce: 0,
    activeListings: 0,
    soldItems: 0
  });

  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    harvestDate: '',
    expiryDate: '',
    location: { address: '', coordinates: null },
    description: '',
    organicCertified: false,
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});

  // Mock data for earnings chart
  const earningsData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 15000 },
    { name: 'Mar', value: 18000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 25000 },
    { name: 'Jun', value: 28000 }
  ];

  const units = ['kg', 'ton', 'quintal', 'piece', 'dozen', 'box'];
  const cropTypes = [
    'Rice', 'Wheat', 'Corn', 'Barley', 'Tomato', 'Potato', 'Onion', 
    'Cabbage', 'Carrot', 'Apple', 'Banana', 'Orange', 'Mango'
  ];

  useEffect(() => {
    // Load saved produce from localStorage
    const saved = localStorage.getItem('farmer_produce');
    if (saved) {
      const produce = JSON.parse(saved);
      setProduceList(produce);
      calculateStats(produce);
    }
  }, []);

  const calculateStats = (produce) => {
    const totalEarnings = produce
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0);
    
    const totalProduce = produce.reduce((sum, p) => sum + p.quantity, 0);
    const activeListings = produce.filter(p => p.status === 'available').length;
    const soldItems = produce.filter(p => p.status === 'sold').length;

    setStats({ totalEarnings, totalProduce, activeListings, soldItems });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cropName) newErrors.cropName = 'Crop name is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) newErrors.pricePerUnit = 'Valid price is required';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    if (!formData.location.address) newErrors.location = 'Location is required';

    // Check if harvest date is not in future
    if (formData.harvestDate && new Date(formData.harvestDate) > new Date()) {
      newErrors.harvestDate = 'Harvest date cannot be in the future';
    }

    // Check if expiry date is after harvest date
    if (formData.expiryDate && formData.harvestDate && 
        new Date(formData.expiryDate) <= new Date(formData.harvestDate)) {
      newErrors.expiryDate = 'Expiry date must be after harvest date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Prepare blockchain data - use individual fields as expected by BlockchainDataInput
      const blockchainInput = {
        type: 'harvest',
        farmerId: 'FARMER_001', // In real app, get from user context
        cropType: formData.cropName,
        quantity: formData.quantity.toString(),
        unit: formData.unit,
        location: formData.location.address,
        quality: 'Grade A', // Could be determined by AI/inspection
        customData: JSON.stringify({
          variety: formData.variety,
          pricePerUnit: formData.pricePerUnit,
          harvestDate: formData.harvestDate,
          expiryDate: formData.expiryDate,
          description: formData.description,
          organicCertified: formData.organicCertified,
          farmerName: 'Current Farmer',
          farmLocation: formData.location.address
        })
      };

      console.log('Submitting to blockchain:', blockchainInput);

      // Submit to blockchain via GraphQL - send individual fields as BlockchainDataInput
      const blockchainResult = await makeGraphQLRequest(CREATE_BLOCKCHAIN_DATA, {
        input: blockchainInput
      });

      if (blockchainResult.createBlockchainData.success) {
        const blockchainData = blockchainResult.createBlockchainData;
        
        // Create local produce entry with blockchain info
        const newProduce = {
          id: editingProduce ? editingProduce.id : Date.now().toString(),
          ...formData,
          quantity: parseFloat(formData.quantity),
          pricePerUnit: parseFloat(formData.pricePerUnit),
          status: 'available',
          farmerName: 'Current Farmer',
          farmLocation: formData.location.address,
          quality: 'Grade A',
          blockchainId: blockchainData.id,
          blockchainTxId: blockchainData.blockchainTxId,
          registeredOnBlockchain: true,
          blockchainTimestamp: blockchainData.data.timestamp,
          verified: blockchainData.data.verified,
          createdAt: editingProduce ? editingProduce.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        let updatedProduce;
        if (editingProduce) {
          updatedProduce = produceList.map(p => p.id === editingProduce.id ? newProduce : p);
        } else {
          updatedProduce = [...produceList, newProduce];
        }

        setProduceList(updatedProduce);
        localStorage.setItem('farmer_produce', JSON.stringify(updatedProduce));
        
        // Also store in marketplace for distributors
        const existingMarketplace = JSON.parse(localStorage.getItem('marketplace_produce') || '[]');
        const marketplaceItem = {
          ...newProduce,
          farmerId: 'FARMER_001',
          isAvailableForDistributors: true
        };
        
        if (editingProduce) {
          const updatedMarketplace = existingMarketplace.map(p => 
            p.id === editingProduce.id ? marketplaceItem : p
          );
          localStorage.setItem('marketplace_produce', JSON.stringify(updatedMarketplace));
        } else {
          localStorage.setItem('marketplace_produce', JSON.stringify([...existingMarketplace, marketplaceItem]));
        }
        
        calculateStats(updatedProduce);

        // Show success message with blockchain details
        alert(`🎉 Product "${newProduce.cropName}" successfully registered on blockchain!\n\n🔗 Blockchain ID: ${blockchainData.id}\n📋 Transaction ID: ${blockchainData.blockchainTxId}\n⏰ Timestamp: ${blockchainData.data.timestamp}\n📍 Location: ${newProduce.farmLocation}\n✅ Now available for distributors to purchase`);

        // Reset form
        setFormData({
          cropName: '', variety: '', quantity: '', unit: 'kg', pricePerUnit: '',
          harvestDate: '', expiryDate: '', location: { address: '', coordinates: null },
          description: '', organicCertified: false, imageUrl: ''
        });
        setShowAddForm(false);
        setEditingProduce(null);

      } else {
        throw new Error(blockchainResult.createBlockchainData.message);
      }

    } catch (error) {
      console.error('Blockchain registration failed:', error);
      alert(`❌ Blockchain registration failed!\n\nError: ${error.message}\n\n💡 Please check:\n1. Backend server is running (http://localhost:4000)\n2. Blockchain network is active\n3. Network connectivity`);
    }
  };

  const handleEdit = (produce) => {
    setFormData(produce);
    setEditingProduce(produce);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this produce listing?')) {
      const updatedProduce = produceList.filter(p => p.id !== id);
      setProduceList(updatedProduce);
      localStorage.setItem('farmer_produce', JSON.stringify(updatedProduce));
      calculateStats(updatedProduce);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your produce and track earnings</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          variant="primary"
          icon={<Plus />}
          className="mt-4 sm:mt-0"
        >
          Add to Blockchain
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings.toLocaleString()}`}
          icon={<DollarSign className="w-8 h-8" />}
          trend="+12%"
          color="green"
        />
        <StatsCard
          title="Total Produce"
          value={`${stats.totalProduce} kg`}
          icon={<Package className="w-8 h-8" />}
          trend="+8%"
          color="blue"
        />
        <StatsCard
          title="Active Listings"
          value={stats.activeListings}
          icon={<TrendingUp className="w-8 h-8" />}
          color="yellow"
        />
        <StatsCard
          title="Items Sold"
          value={stats.soldItems}
          icon={<Calendar className="w-8 h-8" />}
          color="purple"
        />
      </div>

      {/* Earnings Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
        <div className="h-64">
          <LineChart
            data={earningsData}
            color="#10b981"
            strokeWidth={3}
          />
        </div>
      </Card>

      {/* Add/Edit Produce Form */}
      {showAddForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProduce ? 'Edit Produce' : 'Add New Produce'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setEditingProduce(null);
                setFormData({
                  cropName: '', variety: '', quantity: '', unit: 'kg', pricePerUnit: '',
                  harvestDate: '', expiryDate: '', location: { address: '', coordinates: null },
                  description: '', organicCertified: false, imageUrl: ''
                });
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Name
                </label>
                <select
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select crop</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                {errors.cropName && <p className="text-red-500 text-sm mt-1">{errors.cropName}</p>}
              </div>

              <Input
                label="Variety"
                name="variety"
                value={formData.variety}
                onChange={handleInputChange}
                placeholder="e.g., Basmati, Cherry"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                error={errors.quantity}
                min="0"
                step="0.1"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Price per Unit (₹)"
                name="pricePerUnit"
                type="number"
                value={formData.pricePerUnit}
                onChange={handleInputChange}
                placeholder="Enter price"
                error={errors.pricePerUnit}
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Harvest Date"
                name="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={handleInputChange}
                error={errors.harvestDate}
              />

              <Input
                label="Expiry Date (Optional)"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                error={errors.expiryDate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Location
              </label>
              <LocationPicker
                value={formData.location}
                onChange={handleLocationChange}
                error={errors.location}
                placeholder="Enter farm location"
              />
            </div>

            <Input
              label="Description (Optional)"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your produce..."
              multiline="true"
              rows={3}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="organicCertified"
                name="organicCertified"
                checked={formData.organicCertified}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="organicCertified" className="ml-2 text-sm text-gray-700">
                Organic Certified
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingProduce ? 'Update & Re-register on Blockchain' : 'Register on Blockchain'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Produce List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Produce</h3>
        
        {produceList.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No produce listed yet</p>
            <Button
              onClick={() => setShowAddForm(true)}
              variant="primary"
              className="mt-4"
            >
              Add Your First Produce
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produceList.map((produce) => (
              <div key={produce.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{produce.cropName}</h4>
                    {produce.variety && (
                      <p className="text-sm text-gray-600">{produce.variety}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(produce.status)}`}>
                    {produce.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Quantity:</span> {produce.quantity} {produce.unit}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Price:</span> ₹{produce.pricePerUnit}/{produce.unit}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Value:</span> ₹{(produce.quantity * produce.pricePerUnit).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Harvest:</span> {new Date(produce.harvestDate).toLocaleDateString()}
                  </p>
                  {produce.organicCertified && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Organic Certified
                    </span>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(produce)}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(produce.id)}
                    icon={<Trash2 className="w-4 h-4" />}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FarmerDashboard;