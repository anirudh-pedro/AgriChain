import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { TRANSFER_OWNERSHIP } from '../../utils/mutations';
import { ArrowRightLeft, User, Package, MapPin, DollarSign, FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const OwnershipTransfer = ({ onSuccess, initialProduceId = '' }) => {
  const [formData, setFormData] = useState({
    produceId: initialProduceId,
    newOwner: '',
    transferLocation: '',
    transferPrice: '',
    notes: '',
    transferType: 'sale' // sale, donation, return
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock mutation function
  const loading = false;
  const error = null;
  const data = null;
  const transferOwnership = async (options) => {
    console.log('Mock transferOwnership called with:', options.variables);
    setIsSubmitting(false);
    const mockResult = {
      transferOwnership: {
        success: true,
        data: {
          id: options.variables.input.produceId,
          newOwner: options.variables.input.newOwner
        },
        message: 'Ownership transferred successfully!'
      }
    };
    
    if (onSuccess) {
      onSuccess(mockResult.transferOwnership.data);
    }
    resetForm();
    return mockResult;
  };

  const resetForm = () => {
    setFormData({
      produceId: '',
      newOwner: '',
      transferLocation: '',
      transferPrice: '',
      notes: '',
      transferType: 'sale'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await transferOwnership({
        variables: {
          input: {
            ...formData,
            transferPrice: formData.transferPrice ? parseFloat(formData.transferPrice) : null
          }
        }
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const transferTypes = [
    { value: 'sale', label: 'Sale', icon: DollarSign, color: 'text-green-600' },
    { value: 'donation', label: 'Donation', icon: User, color: 'text-blue-600' },
    { value: 'return', label: 'Return', icon: ArrowRightLeft, color: 'text-orange-600' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'text-purple-600' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <ArrowRightLeft className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Transfer Ownership</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error.message}</span>
        </div>
      )}

      {data && data.transferOwnership && data.transferOwnership.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <span className="text-green-700 font-medium">Ownership transferred successfully!</span>
            <p className="text-green-600 text-sm mt-1">
              {data.transferOwnership.message || 'The produce ownership has been updated on the blockchain.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Transfer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="inline h-4 w-4 mr-1" />
              Produce ID *
            </label>
            <input
              type="text"
              required
              value={formData.produceId}
              onChange={(e) => handleInputChange('produceId', e.target.value)}
              placeholder="Enter produce ID to transfer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              New Owner *
            </label>
            <input
              type="text"
              required
              value={formData.newOwner}
              onChange={(e) => handleInputChange('newOwner', e.target.value)}
              placeholder="New owner's name or ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Transfer Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Transfer Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {transferTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.value}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.transferType === type.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="transferType"
                    value={type.value}
                    checked={formData.transferType === type.value}
                    onChange={(e) => handleInputChange('transferType', e.target.value)}
                    className="sr-only"
                  />
                  <Icon className={`h-5 w-5 mr-2 ${type.color}`} />
                  <span className="text-sm font-medium text-gray-900">{type.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Location and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Transfer Location
            </label>
            <input
              type="text"
              value={formData.transferLocation}
              onChange={(e) => handleInputChange('transferLocation', e.target.value)}
              placeholder="Where is the transfer taking place?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {formData.transferType === 'sale' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Transfer Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.transferPrice}
                onChange={(e) => handleInputChange('transferPrice', e.target.value)}
                placeholder="Sale price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Transfer Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes about this transfer (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Transfer Summary */}
        {formData.produceId && formData.newOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Transfer Summary</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Produce:</strong> {formData.produceId}</p>
              <p><strong>New Owner:</strong> {formData.newOwner}</p>
              <p><strong>Type:</strong> {transferTypes.find(t => t.value === formData.transferType)?.label}</p>
              {formData.transferLocation && <p><strong>Location:</strong> {formData.transferLocation}</p>}
              {formData.transferPrice && <p><strong>Price:</strong> ${formData.transferPrice}</p>}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading || isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {(loading || isSubmitting) ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Processing Transfer...</span>
              </>
            ) : (
              <>
                <ArrowRightLeft className="h-4 w-4" />
                <span>Transfer Ownership</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnershipTransfer;