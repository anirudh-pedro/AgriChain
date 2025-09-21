import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { ADD_PRODUCE } from '../../utils/mutations';
import { Leaf, Package, MapPin, Calendar, DollarSign, Award, AlertCircle, CheckCircle } from 'lucide-react';

const AddProduceForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    produceType: '',
    variety: '',
    farmName: '',
    location: {
      address: '',
      region: '',
      country: ''
    },
    quantity: {
      amount: '',
      unit: 'kg'
    },
    quality: {
      grade: 'A',
      expiryDate: ''
    },
    farmGatePrice: '',
    harvestDate: new Date().toISOString().split('T')[0],
    certifications: []
  });

  const [certificationInput, setCertificationInput] = useState({ type: '', certifiedBy: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock mutation function
  const loading = false;
  const error = null;
  const addProduce = async (options) => {
    console.log('Mock addProduce called with:', options.variables);
    setIsSubmitting(false);
    const mockResult = {
      addProduce: {
        success: true,
        data: {
          id: 'PROD-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0') + '-2024',
          ...options.variables.input
        }
      }
    };
    
    if (onSuccess) {
      onSuccess(mockResult.addProduce.data);
    }
    resetForm();
    return mockResult;
  };

  const resetForm = () => {
    setFormData({
      produceType: '',
      variety: '',
      farmName: '',
      location: { address: '', region: '', country: '' },
      quantity: { amount: '', unit: 'kg' },
      quality: { grade: 'A', expiryDate: '' },
      farmGatePrice: '',
      harvestDate: new Date().toISOString().split('T')[0],
      certifications: []
    });
    setCertificationInput({ type: '', certifiedBy: '' });
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addCertification = () => {
    if (certificationInput.type && certificationInput.certifiedBy) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...certificationInput }]
      }));
      setCertificationInput({ type: '', certifiedBy: '' });
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addProduce({
        variables: {
          input: {
            ...formData,
            quantity: {
              ...formData.quantity,
              amount: parseFloat(formData.quantity.amount)
            },
            farmGatePrice: parseFloat(formData.farmGatePrice) || 0
          }
        }
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <Leaf className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Add New Produce</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="inline h-4 w-4 mr-1" />
              Produce Type *
            </label>
            <input
              type="text"
              required
              value={formData.produceType}
              onChange={(e) => handleInputChange('produceType', e.target.value)}
              placeholder="e.g., Tomatoes, Apples, Carrots"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variety
            </label>
            <input
              type="text"
              value={formData.variety}
              onChange={(e) => handleInputChange('variety', e.target.value)}
              placeholder="e.g., Roma, Gala, Baby"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Name *
            </label>
            <input
              type="text"
              required
              value={formData.farmName}
              onChange={(e) => handleInputChange('farmName', e.target.value)}
              placeholder="Your farm name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Harvest Date *
            </label>
            <input
              type="date"
              required
              value={formData.harvestDate}
              onChange={(e) => handleInputChange('harvestDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                required
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                placeholder="Farm address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region/State *</label>
              <input
                type="text"
                required
                value={formData.location.region}
                onChange={(e) => handleInputChange('location.region', e.target.value)}
                placeholder="Region or state"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                required
                value={formData.location.country}
                onChange={(e) => handleInputChange('location.country', e.target.value)}
                placeholder="Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Quantity and Quality */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.quantity.amount}
              onChange={(e) => handleInputChange('quantity.amount', e.target.value)}
              placeholder="Amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select
              value={formData.quantity.unit}
              onChange={(e) => handleInputChange('quantity.unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="kg">Kilograms</option>
              <option value="lbs">Pounds</option>
              <option value="tons">Tons</option>
              <option value="boxes">Boxes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Grade</label>
            <select
              value={formData.quality.grade}
              onChange={(e) => handleInputChange('quality.grade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="A+">A+ Premium</option>
              <option value="A">A Standard</option>
              <option value="B">B Good</option>
              <option value="C">C Fair</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Farm Gate Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.farmGatePrice}
              onChange={(e) => handleInputChange('farmGatePrice', e.target.value)}
              placeholder="Price per unit"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
          <input
            type="date"
            value={formData.quality.expiryDate}
            onChange={(e) => handleInputChange('quality.expiryDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-green-600" />
            Certifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Certification type (e.g., Organic)"
              value={certificationInput.type}
              onChange={(e) => setCertificationInput(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Certified by (e.g., USDA)"
              value={certificationInput.certifiedBy}
              onChange={(e) => setCertificationInput(prev => ({ ...prev, certifiedBy: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addCertification}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Certification
            </button>
          </div>

          {formData.certifications.length > 0 && (
            <div className="space-y-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <span className="text-green-800">
                    <strong>{cert.type}</strong> - Certified by {cert.certifiedBy}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {(loading || isSubmitting) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Adding Produce...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Add Produce</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduceForm;