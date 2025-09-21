import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddProduceForm } from '../../components/Produce';
import { ArrowLeft } from 'lucide-react';

const AddProducePage = () => {
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    console.log('Produce added successfully:', data);
    // Navigate to QR code generation page if produce ID is available
    if (data?.id) {
      navigate(`/produce/qr/${data.id}`);
    } else {
      navigate('/produce');
    }
  };

  const handleBack = () => {
    navigate('/produce');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Produce Management
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Produce</h1>
          <p className="text-gray-600 mt-1">Register fresh produce on the blockchain</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-8">
        <AddProduceForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default AddProducePage;