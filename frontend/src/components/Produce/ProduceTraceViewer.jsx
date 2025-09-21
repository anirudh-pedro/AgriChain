import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_PRODUCE_TRACE } from '../../utils/queries';
import { Search, Package, MapPin, Calendar, User, Truck, Eye, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const ProduceTraceViewer = () => {
  const [produceId, setProduceId] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Mock data for demonstration
  const loading = false;
  const error = null;
  const data = searchTriggered && produceId ? {
    getProduceTrace: {
      success: true,
      data: {
        id: produceId,
        produceType: 'Organic Tomatoes',
        variety: 'Roma',
        farmName: 'Green Valley Farm',
        currentOwner: 'Metro Supermarket',
        harvestDate: '2024-01-10',
        status: 'active',
        quantity: { amount: 50, unit: 'kg' },
        quality: { grade: 'A+', expiryDate: '2024-01-20' },
        farmGatePrice: 4.99,
        location: {
          address: '123 Farm Road',
          region: 'California',
          country: 'USA'
        },
        certifications: [
          { type: 'Organic', certifiedBy: 'USDA' },
          { type: 'Non-GMO', certifiedBy: 'Non-GMO Project' }
        ]
      },
      history: [
        {
          eventType: 'Harvest',
          timestamp: '2024-01-10T08:00:00Z',
          fromParticipant: 'Green Valley Farm',
          toParticipant: 'Green Valley Farm',
          location: 'California, USA',
          qualityGrade: 'A+',
          notes: 'Fresh harvest, optimal conditions'
        },
        {
          eventType: 'Quality Inspection',
          timestamp: '2024-01-10T14:00:00Z',
          fromParticipant: 'Green Valley Farm',
          toParticipant: 'Quality Inspector',
          location: 'Farm Processing Center',
          qualityGrade: 'A+',
          notes: 'Passed all quality checks'
        },
        {
          eventType: 'Transfer to Distributor',
          timestamp: '2024-01-11T10:00:00Z',
          fromParticipant: 'Green Valley Farm',
          toParticipant: 'Fresh Foods Distribution',
          location: 'Distribution Center',
          qualityGrade: 'A+',
          notes: 'Transferred for distribution'
        },
        {
          eventType: 'Transfer to Retailer',
          timestamp: '2024-01-12T15:00:00Z',
          fromParticipant: 'Fresh Foods Distribution',
          toParticipant: 'Metro Supermarket',
          location: 'Metro Supermarket',
          qualityGrade: 'A+',
          notes: 'Final delivery to retail location'
        }
      ]
    }
  } : null;

  const refetch = () => {
    // Mock refetch function
    console.log('Refetching data for:', produceId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (produceId.trim()) {
      setSearchTriggered(true);
      if (searchTriggered) {
        refetch();
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_transit':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'expired':
      case 'consumed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
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

  const renderProduceDetails = (produce) => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-2 text-green-600" />
          {produce.produceType} {produce.variety && `- ${produce.variety}`}
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(produce.status)}`}>
          {getStatusIcon(produce.status)}
          <span>{produce.status || 'Unknown'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Current Owner</p>
            <p className="font-medium">{produce.currentOwner || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Origin</p>
            <p className="font-medium">{produce.farmName || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Harvest Date</p>
            <p className="font-medium">{formatDate(produce.harvestDate)}</p>
          </div>
        </div>

        {produce.quantity && (
          <div>
            <p className="text-sm text-gray-600">Quantity</p>
            <p className="font-medium">{produce.quantity.amount} {produce.quantity.unit}</p>
          </div>
        )}

        {produce.quality && (
          <div>
            <p className="text-sm text-gray-600">Quality Grade</p>
            <p className="font-medium">{produce.quality.grade}</p>
            {produce.quality.expiryDate && (
              <p className="text-xs text-gray-500">Expires: {formatDate(produce.quality.expiryDate)}</p>
            )}
          </div>
        )}

        {produce.farmGatePrice && (
          <div>
            <p className="text-sm text-gray-600">Farm Gate Price</p>
            <p className="font-medium">${produce.farmGatePrice}</p>
          </div>
        )}
      </div>

      {produce.location && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
          <p className="text-sm text-gray-600">
            {produce.location.address}, {produce.location.region}, {produce.location.country}
          </p>
        </div>
      )}

      {produce.certifications && produce.certifications.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            {produce.certifications.map((cert, index) => (
              <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {cert.type} - {cert.certifiedBy}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSupplyChainHistory = (history) => {
    if (!history || history.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No supply chain history available for this produce.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Truck className="h-6 w-6 mr-2 text-blue-600" />
          Supply Chain Journey
        </h3>

        <div className="space-y-4">
          {history.map((event, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{index + 1}</span>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{event.eventType || 'Supply Chain Event'}</h4>
                  <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {event.fromParticipant && (
                    <div>
                      <span className="text-gray-600">From: </span>
                      <span className="font-medium">{event.fromParticipant}</span>
                    </div>
                  )}
                  
                  {event.toParticipant && (
                    <div>
                      <span className="text-gray-600">To: </span>
                      <span className="font-medium">{event.toParticipant}</span>
                    </div>
                  )}
                  
                  {event.location && (
                    <div>
                      <span className="text-gray-600">Location: </span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                  )}
                  
                  {event.qualityGrade && (
                    <div>
                      <span className="text-gray-600">Quality: </span>
                      <span className="font-medium">{event.qualityGrade}</span>
                    </div>
                  )}
                </div>
                
                {event.notes && (
                  <p className="text-gray-600 text-sm mt-2">{event.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Eye className="h-8 w-8 mr-3 text-green-600" />
          Produce Traceability Viewer
        </h1>
        <p className="text-gray-600">Track the complete journey of produce from farm to consumer</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-grow">
            <label htmlFor="produceId" className="block text-sm font-medium text-gray-700 mb-2">
              Produce ID or QR Code
            </label>
            <input
              type="text"
              id="produceId"
              value={produceId}
              onChange={(e) => setProduceId(e.target.value)}
              placeholder="Enter produce ID to trace its journey..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !produceId.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Trace Produce</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Error occurred while tracing produce</h3>
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {data && data.getProduceTrace && (
        <div className="space-y-6">
          {data.getProduceTrace.success ? (
            <>
              {/* Produce Details */}
              {data.getProduceTrace.data && renderProduceDetails(data.getProduceTrace.data)}
              
              {/* Supply Chain History */}
              {data.getProduceTrace.history && renderSupplyChainHistory(data.getProduceTrace.history)}
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-800 font-medium">Produce not found</h3>
                  <p className="text-yellow-600 text-sm mt-1">
                    {data.getProduceTrace.message || 'No produce found with the provided ID.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No search performed yet */}
      {!searchTriggered && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to trace produce</h3>
          <p className="text-gray-600">Enter a produce ID above to view its complete supply chain journey</p>
        </div>
      )}
    </div>
  );
};

export default ProduceTraceViewer;