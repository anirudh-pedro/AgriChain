import React from 'react';
import { ShoppingCart, DollarSign, Package, Users } from 'lucide-react';
import { StatsCard } from '../../components/UI/Card';

const DistributorDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
          <p className="text-gray-600 mt-1">Source quality produce from farmers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Spent"
          value="₹5,000"
          icon={<DollarSign className="w-8 h-8" />}
          trend="+15%"
          color="green"
        />
        <StatsCard
          title="Total Purchases"
          value="1"
          icon={<ShoppingCart className="w-8 h-8" />}
          trend="+12%"
          color="blue"
        />
        <StatsCard
          title="Active Farmers"
          value="1"
          icon={<Users className="w-8 h-8" />}
          color="yellow"
        />
        <StatsCard
          title="Monthly Volume"
          value="100 kg"
          icon={<Package className="w-8 h-8" />}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 min-h-96 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Marketplace Coming Soon</h3>
          <p className="text-gray-500">Browse and purchase quality produce from verified farmers</p>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;