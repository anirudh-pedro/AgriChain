import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import Input from './Input';

const LocationPicker = ({ value = { address: '', coordinates: null }, onChange, error }) => {
  const [isSearching, setIsSearching] = useState(false);
  
  const handleAddressChange = (e) => {
    const address = e.target.value;
    onChange({
      address,
      coordinates: value.coordinates
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onChange({
            address: value.address || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
            coordinates
          });
          setIsSearching(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsSearching(false);
          alert('Unable to get current location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          value={value.address}
          onChange={handleAddressChange}
          placeholder="Enter farm location address"
          className="pl-10"
          error={error}
        />
      </div>
      
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isSearching}
        className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 disabled:opacity-50"
      >
        <Search className="w-4 h-4" />
        <span>{isSearching ? 'Getting location...' : 'Use current location'}</span>
      </button>

      {value.coordinates && (
        <div className="text-xs text-gray-500">
          Coordinates: {value.coordinates.lat.toFixed(4)}, {value.coordinates.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;