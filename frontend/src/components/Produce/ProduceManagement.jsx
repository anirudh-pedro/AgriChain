import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_ALL_PRODUCE } from '../../utils/queries';
import { Plus, Filter, Download, Search, Package, MapPin, Calendar, User, Truck, ArrowRight, Eye, Edit } from 'lucide-react';

const ProduceManagement = ({ onAddProduce, onViewTrace, onTransferOwnership, onQualityInspection }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    location: '',
    dateFrom: '',
    dateTo: ''
  });

  const [sortBy, setSortBy] = useState('harvestDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data for demonstration
  const loading = false;
  const error = null;
  const data = {
    getAllProduce: {
      success: true,
      data: [
        {
          id: 'PROD-001-2024',
          produceType: 'Organic Tomatoes',
          variety: 'Roma',
          farmName: 'Green Valley Farm',
          currentOwner: 'Green Valley Farm',
          harvestDate: '2024-01-10',
          status: 'active',
          quantity: { amount: 50, unit: 'kg' },
          quality: { grade: 'A+' },
          location: { address: '123 Farm Road', region: 'California', country: 'USA' }
        },
        {
          id: 'PROD-002-2024',
          produceType: 'Fresh Lettuce',
          variety: 'Iceberg',
          farmName: 'Sunny Acres',
          currentOwner: 'Fresh Foods Distribution',
          harvestDate: '2024-01-12',
          status: 'in_transit',
          quantity: { amount: 30, unit: 'kg' },
          quality: { grade: 'A' },
          location: { address: '456 Farm Lane', region: 'Oregon', country: 'USA' }
        },
        {
          id: 'PROD-003-2024',
          produceType: 'Bell Peppers',
          variety: 'Red',
          farmName: 'Heritage Farms',
          currentOwner: 'Metro Supermarket',
          harvestDate: '2024-01-08',
          status: 'available',
          quantity: { amount: 75, unit: 'kg' },
          quality: { grade: 'A' },
          location: { address: '789 Heritage Road', region: 'Texas', country: 'USA' }
        }
      ]
    }
  };

  const refetch = () => {
    console.log('Refetching produce data...');
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      location: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const exportData = () => {
    if (data && data.getAllProduce && data.getAllProduce.data) {
      const csvContent = generateCSV(data.getAllProduce.data);
      downloadCSV(csvContent, 'produce-management.csv');
    }
  };

  const generateCSV = (produces) => {
    const headers = ['ID', 'Type', 'Variety', 'Farm', 'Quantity', 'Quality', 'Status', 'Owner', 'Harvest Date', 'Location'];
    const rows = produces.map(produce => [
      produce.id || '',
      produce.produceType || '',
      produce.variety || '',
      produce.farmName || '',
      `${produce.quantity?.amount || ''} ${produce.quantity?.unit || ''}`,
      produce.quality?.grade || '',
      produce.status || '',
      produce.currentOwner || '',
      produce.harvestDate ? new Date(produce.harvestDate).toLocaleDateString() : '',
      `${produce.location?.address || ''}, ${produce.location?.region || ''}`
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'consumed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (grade) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-600 text-white';
      case 'A':
        return 'bg-green-500 text-white';
      case 'B':
        return 'bg-yellow-500 text-white';
      case 'C':
        return 'bg-orange-500 text-white';
      case 'D':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 mr-3 text-green-600" />
            Produce Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all produce in the supply chain</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            disabled={!data?.getAllProduce?.data?.length}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onAddProduce}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Produce</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search produce..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="in_transit">In Transit</option>
              <option value="processing">Processing</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Filter by location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading produce data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error loading produce: {error.message}</p>
        </div>
      )}

      {data && data.getAllProduce && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {data.getAllProduce.success ? (
            <>
              {/* Results Summary */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {data.getAllProduce.data?.length || 0} produce items
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        onClick={() => handleSort('produceType')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Produce
                      </th>
                      <th
                        onClick={() => handleSort('farmName')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Farm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th
                        onClick={() => handleSort('currentOwner')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Owner
                      </th>
                      <th
                        onClick={() => handleSort('harvestDate')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Harvest Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.getAllProduce.data?.map((produce, index) => (
                      <tr key={produce.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {produce.produceType}
                              </div>
                              {produce.variety && (
                                <div className="text-sm text-gray-500">{produce.variety}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">{produce.farmName}</div>
                              <div className="text-sm text-gray-500">
                                {produce.location?.region}, {produce.location?.country}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produce.quantity?.amount} {produce.quantity?.unit}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(produce.quality?.grade)}`}>
                            {produce.quality?.grade || 'N/A'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(produce.status)}`}>
                            {produce.status || 'Unknown'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{produce.currentOwner}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{formatDate(produce.harvestDate)}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => onViewTrace && onViewTrace(produce.id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Trace"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onTransferOwnership && onTransferOwnership(produce.id)}
                              className="text-purple-600 hover:text-purple-800 p-1"
                              title="Transfer Ownership"
                            >
                              <Truck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onQualityInspection && onQualityInspection(produce.id)}
                              className="text-orange-600 hover:text-orange-800 p-1"
                              title="Quality Inspection"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(!data.getAllProduce.data || data.getAllProduce.data.length === 0) && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No produce found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or add some produce to get started.</p>
                  <button
                    onClick={onAddProduce}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add First Produce</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-red-600">{data.getAllProduce.message || 'Failed to load produce data'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProduceManagement;