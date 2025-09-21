import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'qrcode';

const FarmerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">🌱 Farmer Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome back, {user?.name || user?.username}! 
          Add your produce, generate QR codes, and track your farm's performance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Produce</h3>
            <p className="text-2xl font-bold text-blue-900">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Active Listings</h3>
            <p className="text-2xl font-bold text-green-900">0</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Total Value</h3>
            <p className="text-2xl font-bold text-purple-900">₹0</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-600">QR Generated</h3>
            <p className="text-2xl font-bold text-orange-900">0</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
            📦 Add New Produce
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
            📱 Generate QR Code
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
            📊 View History
          </button>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to get started?</h3>
          <p className="text-gray-600 mb-4">
            Add your first produce to begin tracking through the supply chain
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✅ Add produce details (name, harvest date, price, quality grade)</p>
            <p>✅ Generate unique QR codes for each batch</p>
            <p>✅ Track ownership transfers to distributors and retailers</p>
            <p>✅ Monitor pricing throughout the supply chain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
