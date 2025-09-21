import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OwnershipTransfer } from '../../components/Produce';
import { ArrowLeft } from 'lucide-react';

const OwnershipTransferPage = () => {
  const { produceId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    console.log('Ownership transferred successfully:', data);
    navigate('/produce');
  };

  const handleBack = () => {
    navigate('/produce');
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
          <h1 className="text-2xl font-bold text-gray-900">Transfer Ownership</h1>
          <p className="text-gray-600 mt-1">Transfer produce ownership in the supply chain</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-8">
        <OwnershipTransfer 
          initialProduceId={produceId}
          onSuccess={handleSuccess} 
        />
      </div>
    </div>
  );
};

export default OwnershipTransferPage;