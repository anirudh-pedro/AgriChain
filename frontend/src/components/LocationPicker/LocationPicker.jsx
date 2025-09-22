import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X, CheckCircle, AlertCircle } from 'lucide-react';

const LocationPicker = ({ 
  value, 
  onChange, 
  placeholder = "Enter farm location...",
  error = null,
  required = false,
  disabled = false,
  className = "",
  showMap = true
}) => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const inputRef = useRef(null);
  const suggestionRefs = useRef([]);

  // Mock location suggestions (replace with actual API in production)
  const mockSuggestions = [
    'Mumbai, Maharashtra, India',
    'Delhi, India',
    'Pune, Maharashtra, India',
    'Bangalore, Karnataka, India',
    'Chennai, Tamil Nadu, India',
    'Hyderabad, Telangana, India'
  ];

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });
      
      // Mock reverse geocoding (replace with actual service in production)
      const mockAddress = `Farm Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
      setSelectedLocation(mockAddress);
      onChange && onChange({
        address: mockAddress,
        coordinates: { lat: latitude, lng: longitude }
      });

    } catch (error) {
      console.error('Geolocation error:', error);
      let errorMessage = 'Unable to get your location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      // You could integrate with NotificationContext here
      console.warn(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSelectedLocation(newValue);
    
    // Show suggestions when typing
    if (newValue.length > 2) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(newValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    onChange && onChange({
      address: newValue,
      coordinates: coordinates
    });
  };

  const selectSuggestion = (suggestion) => {
    setSelectedLocation(suggestion);
    setShowSuggestions(false);
    // Mock coordinates for selected suggestion
    setCoordinates({ lat: 19.0760 + Math.random() * 10, lng: 72.8777 + Math.random() * 10 });
    
    onChange && onChange({
      address: suggestion,
      coordinates: coordinates
    });
  };

  const clearInput = () => {
    setSelectedLocation('');
    setCoordinates(null);
    setShowSuggestions(false);
    onChange && onChange({ address: '', coordinates: null });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const inputClasses = `
    w-full px-4 py-3 pl-12 pr-20 
    bg-white border border-gray-300 rounded-xl
    text-gray-900 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
    transition-all duration-200 ease-in-out
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'hover:border-gray-400'}
    ${selectedLocation && coordinates ? 'border-green-500' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative" ref={inputRef}>
        {/* Input Field */}
        <input
          type="text"
          value={selectedLocation}
          onChange={handleInputChange}
          disabled={disabled}
          className={inputClasses}
          placeholder={placeholder}
          autoComplete="off"
        />
        
        {/* Map Pin Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <MapPin 
            size={20} 
            className={`transition-colors ${
              error ? 'text-red-500' :
              selectedLocation && coordinates ? 'text-green-500' :
              'text-gray-400'
            }`} 
          />
        </div>
        
        {/* Right Side Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Success Indicator */}
          {selectedLocation && coordinates && !error && (
            <CheckCircle size={18} className="text-green-500" />
          )}
          
          {/* Error Indicator */}
          {error && (
            <AlertCircle size={18} className="text-red-500" />
          )}
          
          {/* Clear Button */}
          {selectedLocation && !disabled && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              title="Clear location"
            >
              <X size={16} />
            </button>
          )}
          
          {/* Current Location Button */}
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoading || disabled}
            className={`p-1 transition-colors rounded-full ${
              isLoading 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Use current location"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            ) : (
              <Navigation size={16} />
            )}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                ref={el => suggestionRefs.current[index] = el}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center space-x-3"
              >
                <Search size={16} className="text-gray-400" />
                <span className="text-gray-900">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center space-x-1">
          <Navigation size={12} />
          <span>Click navigation icon to use your current location</span>
        </span>
        
        {showMap && (
          <button
            type="button"
            onClick={() => setIsMapVisible(!isMapVisible)}
            className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            {isMapVisible ? 'Hide Map' : 'Show Map Preview'}
          </button>
        )}
      </div>
      
      {/* Interactive Map Preview */}
      {showMap && isMapVisible && (
        <div className="mt-4 p-1 bg-white rounded-xl border border-gray-200 shadow-lg">
          <div className="relative h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden">
            {/* Map Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <MapPin size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Map</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Google Maps integration will be available here
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <Search size={12} />
                    <span>Location search & autocomplete</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin size={12} />
                    <span>Pin dropping & address lookup</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Navigation size={12} />
                    <span>GPS location detection</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coordinates Display */}
            {coordinates && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <div className="text-xs text-gray-600">
                  <div className="font-medium">Coordinates:</div>
                  <div>Lat: {coordinates.lat.toFixed(6)}</div>
                  <div>Lng: {coordinates.lng.toFixed(6)}</div>
                </div>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {selectedLocation && coordinates ? (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <CheckCircle size={12} />
                  <span>Location Set</span>
                </div>
              ) : (
                <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  No Location
                </div>
              )}
            </div>
            
            {/* Mock Map Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;