import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeGenerator, QRCodeScanner } from '../../components/QRCode';
import { ArrowLeft, Package, Scan } from 'lucide-react';

const QRCodePage = () => {
  const { produceId } = useParams();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [qrSuccess, setQrSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration - will be replaced with actual API calls
  const produceData = produceId ? {
    id: produceId,
    name: 'Organic Tomatoes',
    farmer: 'John Smith Farm',
    harvestDate: '2024-01-15',
    location: 'California, USA',
    batchId: 'TOM-2024-001',
    currentOwner: 'Fresh Farms Co.',
    currentLocation: 'Processing Facility',
    status: 'In Transit'
  } : null;

  const handleBack = () => {
    navigate('/produce');
  };

  const handleQRSuccess = (result) => {
    console.log('QR Code generated successfully:', result);
    setQrSuccess(true);
  };

  const handleScanSuccess = (scannedProduceId) => {
    console.log('QR Code scanned:', scannedProduceId);
    setShowScanner(false);
    navigate(`/produce/trace/${scannedProduceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Produce Management
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
              <p className="text-gray-600 mt-1">Generate and manage QR codes for produce traceability</p>
            </div>

            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading produce data...</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="text-red-800 font-medium">Error Loading Produce</h3>
                  <p className="text-red-600 text-sm mt-1">{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {produceId && !loading && !error && (
          <QRCodeGenerator 
            produceId={produceId}
            produceData={produceData}
            onSuccess={handleQRSuccess}
          />
        )}

        {!produceId && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Produce Selected</h3>
              <p className="text-gray-600 mb-6">
                Select a produce item from the management page to generate its QR code.
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Produce Management
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {qrSuccess && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-green-800 font-medium">QR Code Generated Successfully!</h3>
                  <p className="text-green-600 text-sm mt-1">
                    The QR code is ready for printing and can be attached to your produce packaging.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default QRCodePage;