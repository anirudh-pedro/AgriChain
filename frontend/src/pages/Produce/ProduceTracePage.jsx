import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProduceTraceViewer } from '../../components/Produce';
import { ArrowLeft, Home } from 'lucide-react';

const ProduceTracePage = ({ isPublic = false }) => {
  const { produceId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    if (isPublic) {
      // For public access, redirect to a landing page or show option to access the full app
      navigate('/');
    } else {
      navigate('/produce');
    }
  };

  const handleGoToApp = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${isPublic ? 'bg-gray-50' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {!isPublic && (
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Produce Management
            </button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isPublic ? 'Product Traceability' : 'Trace Produce Journey'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isPublic 
                  ? 'View the complete journey of your produce from farm to table'
                  : 'Track the complete supply chain journey of produce'
                }
              </p>
            </div>

            {isPublic && (
              <button
                onClick={handleGoToApp}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Access Full Platform
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <ProduceTraceViewer initialProduceId={produceId} />
      </div>

      {/* Public Footer */}
      {isPublic && (
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Powered by AgriChain
              </h3>
              <p className="text-gray-600 mb-4">
                Blockchain-powered supply chain transparency for agriculture
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join as Producer
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ProduceTracePage;