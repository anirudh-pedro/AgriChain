import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { UPDATE_QUALITY } from '../../utils/mutations';
import { Award, Package, Calendar, FileText, Thermometer, Eye, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const QualityInspection = ({ onSuccess, initialProduceId = '' }) => {
  const [formData, setFormData] = useState({
    produceId: initialProduceId,
    qualityGrade: 'A',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectorName: '',
    inspectionLocation: '',
    qualityNotes: '',
    temperature: '',
    moisture: '',
    appearance: '',
    defects: '',
    storageConditions: '',
    expiryDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock mutation function
  const loading = false;
  const error = null;
  const data = null;
  const updateQuality = async (options) => {
    console.log('Mock updateQuality called with:', options.variables);
    setIsSubmitting(false);
    const mockResult = {
      updateQuality: {
        success: true,
        data: {
          id: options.variables.input.produceId,
          qualityGrade: options.variables.input.qualityGrade
        },
        message: 'Quality inspection recorded successfully!'
      }
    };
    
    if (onSuccess) {
      onSuccess(mockResult.updateQuality.data);
    }
    resetForm();
    return mockResult;
  };

  const resetForm = () => {
    setFormData({
      produceId: '',
      qualityGrade: 'A',
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorName: '',
      inspectionLocation: '',
      qualityNotes: '',
      temperature: '',
      moisture: '',
      appearance: '',
      defects: '',
      storageConditions: '',
      expiryDate: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        produceId: formData.produceId,
        qualityGrade: formData.qualityGrade,
        inspectionDate: formData.inspectionDate,
        inspectorName: formData.inspectorName,
        qualityNotes: formData.qualityNotes
      };

      // Add optional fields if they have values
      if (formData.inspectionLocation) updateData.inspectionLocation = formData.inspectionLocation;
      if (formData.expiryDate) updateData.expiryDate = formData.expiryDate;

      // Build inspection details object
      const inspectionDetails = {};
      if (formData.temperature) inspectionDetails.temperature = formData.temperature;
      if (formData.moisture) inspectionDetails.moisture = formData.moisture;
      if (formData.appearance) inspectionDetails.appearance = formData.appearance;
      if (formData.defects) inspectionDetails.defects = formData.defects;
      if (formData.storageConditions) inspectionDetails.storageConditions = formData.storageConditions;

      if (Object.keys(inspectionDetails).length > 0) {
        updateData.inspectionDetails = inspectionDetails;
      }

      await updateQuality({
        variables: { input: updateData }
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const qualityGrades = [
    { value: 'A+', label: 'A+ Premium', color: 'bg-green-600', description: 'Exceptional quality, no defects' },
    { value: 'A', label: 'A Standard', color: 'bg-green-500', description: 'High quality, minimal defects' },
    { value: 'B', label: 'B Good', color: 'bg-yellow-500', description: 'Good quality, minor defects' },
    { value: 'C', label: 'C Fair', color: 'bg-orange-500', description: 'Fair quality, noticeable defects' },
    { value: 'D', label: 'D Poor', color: 'bg-red-500', description: 'Poor quality, significant defects' }
  ];

  const getGradeInfo = (grade) => {
    return qualityGrades.find(g => g.value === grade) || qualityGrades[1];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <Award className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Quality Inspection</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error.message}</span>
        </div>
      )}

      {data && data.updateQuality && data.updateQuality.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <span className="text-green-700 font-medium">Quality inspection recorded successfully!</span>
            <p className="text-green-600 text-sm mt-1">
              {data.updateQuality.message || 'The quality update has been saved to the blockchain.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
              placeholder="Enter produce ID to inspect"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Inspection Date *
            </label>
            <input
              type="date"
              required
              value={formData.inspectionDate}
              onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Eye className="inline h-4 w-4 mr-1" />
              Inspector Name *
            </label>
            <input
              type="text"
              required
              value={formData.inspectorName}
              onChange={(e) => handleInputChange('inspectorName', e.target.value)}
              placeholder="Quality inspector's name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inspection Location
            </label>
            <input
              type="text"
              value={formData.inspectionLocation}
              onChange={(e) => handleInputChange('inspectionLocation', e.target.value)}
              placeholder="Where inspection was performed"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quality Grade Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Quality Grade *</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {qualityGrades.map((grade) => (
              <label
                key={grade.value}
                className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.qualityGrade === grade.value
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="qualityGrade"
                  value={grade.value}
                  checked={formData.qualityGrade === grade.value}
                  onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-8 h-8 rounded-full ${grade.color} mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{grade.value}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 mb-1">{grade.label}</span>
                <span className="text-xs text-gray-600 text-center">{grade.description}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Inspection Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Inspection Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="inline h-4 w-4 mr-1" />
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="Storage temperature"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moisture (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.moisture}
                onChange={(e) => handleInputChange('moisture', e.target.value)}
                placeholder="Moisture content"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appearance Assessment
              </label>
              <select
                value={formData.appearance}
                onChange={(e) => handleInputChange('appearance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select appearance</option>
                <option value="excellent">Excellent - Fresh and vibrant</option>
                <option value="good">Good - Minor color changes</option>
                <option value="fair">Fair - Noticeable deterioration</option>
                <option value="poor">Poor - Significant deterioration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Defects Level
              </label>
              <select
                value={formData.defects}
                onChange={(e) => handleInputChange('defects', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select defect level</option>
                <option value="none">None - No visible defects</option>
                <option value="minimal">Minimal - Very few defects</option>
                <option value="minor">Minor - Some defects present</option>
                <option value="major">Major - Significant defects</option>
                <option value="severe">Severe - Extensive defects</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Conditions
            </label>
            <input
              type="text"
              value={formData.storageConditions}
              onChange={(e) => handleInputChange('storageConditions', e.target.value)}
              placeholder="Describe current storage conditions"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quality Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Quality Notes *
          </label>
          <textarea
            required
            value={formData.qualityNotes}
            onChange={(e) => handleInputChange('qualityNotes', e.target.value)}
            placeholder="Detailed notes about the quality inspection findings..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Inspection Summary */}
        {formData.produceId && formData.qualityGrade && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">Inspection Summary</h3>
            <div className="space-y-1 text-sm text-purple-800">
              <p><strong>Produce:</strong> {formData.produceId}</p>
              <div className="flex items-center space-x-2">
                <strong>Quality Grade:</strong>
                <div className={`w-6 h-6 rounded-full ${getGradeInfo(formData.qualityGrade).color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">{formData.qualityGrade}</span>
                </div>
                <span>{getGradeInfo(formData.qualityGrade).label}</span>
              </div>
              <p><strong>Inspector:</strong> {formData.inspectorName}</p>
              <p><strong>Date:</strong> {new Date(formData.inspectionDate).toLocaleDateString()}</p>
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
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {(loading || isSubmitting) ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Recording Inspection...</span>
              </>
            ) : (
              <>
                <Award className="h-4 w-4" />
                <span>Record Inspection</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QualityInspection;