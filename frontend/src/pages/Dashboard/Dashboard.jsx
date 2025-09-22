import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  Home,
  Settings,
  HelpCircle,
  Search,
  BarChart3,
  History,
  QrCode
} from 'lucide-react';
import FarmerDashboard from './FarmerDashboard';
import DistributorDashboard from './DistributorDashboard';
import RetailerDashboard from './RetailerDashboard';
import ConsumerDashboard from './ConsumerDashboard';
import AdminDashboard from './AdminDashboard';
import TraceabilityPage from '../Traceability/TraceabilityPage';
import TransactionHistory from '../Transactions/TransactionHistory';
import AnalyticsDashboard from '../Analytics/AnalyticsDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth(); // Use user from AuthContext
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const navigate = useNavigate();

  // No need for authentication check here since ProtectedRoute handles it

  const handleLogout = () => {
    logout(); // Use logout from AuthContext
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      farmer: 'Farmer',
      distributor: 'Distributor',
      retailer: 'Retailer',
      consumer: 'Consumer',
      admin: 'Administrator'
    };
    return roleMap[role] || role;
  };

  const getDashboardComponent = () => {
    switch (activeView) {
      case 'dashboard':
        switch (user?.role) {
          case 'farmer':
            return <FarmerDashboard user={user} />;
          case 'distributor':
            return <DistributorDashboard user={user} />;
          case 'retailer':
            return <RetailerDashboard user={user} />;
          case 'consumer':
            return <ConsumerDashboard user={user} />;
          case 'admin':
            return <AdminDashboard user={user} />;
          default:
            return (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Invalid user role</p>
              </div>
            );
        }
      case 'traceability':
        return <TraceabilityPage />;
      case 'transactions':
        return <TransactionHistory userRole={user?.role} />;
      case 'analytics':
        return <AnalyticsDashboard userRole={user?.role} />;
      default:
        return getDashboardComponent();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center">
        <div className="text-emerald-800 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-white/30 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <h1 className="text-xl font-bold text-emerald-800">AgriChain</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-emerald-700 hover:text-emerald-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-100/80">
              <User size={20} className="text-emerald-600" />
              <div>
                <p className="text-emerald-800 font-medium">{user?.name || user?.businessName}</p>
                <p className="text-emerald-600 text-sm">{getRoleDisplayName(user?.role)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2 px-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                activeView === 'dashboard'
                  ? 'text-emerald-800 bg-emerald-200/40 border border-emerald-300/40'
                  : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/40'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveView('traceability')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                activeView === 'traceability'
                  ? 'text-emerald-800 bg-emerald-200/40 border border-emerald-300/40'
                  : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/40'
              }`}
            >
              <Search size={20} />
              <span>Trace Produce</span>
            </button>
            
            <button
              onClick={() => setActiveView('transactions')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                activeView === 'transactions'
                  ? 'text-emerald-800 bg-emerald-200/40 border border-emerald-300/40'
                  : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/40'
              }`}
            >
              <History size={20} />
              <span>Transaction History</span>
            </button>
            
            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                activeView === 'analytics'
                  ? 'text-emerald-800 bg-emerald-200/40 border border-emerald-300/40'
                  : 'text-emerald-600 hover:text-emerald-800 hover:bg-white/40'
              }`}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </button>
            
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-white/40 transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-white/40 transition-colors"
            >
              <HelpCircle size={20} />
              <span>Help</span>
            </a>
          </div>
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:text-red-500 hover:bg-red-50/40 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/60 backdrop-blur-xl border-b border-white/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-emerald-800">
                {getRoleDisplayName(user?.role)} Dashboard
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-emerald-700 hover:text-emerald-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {getDashboardComponent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;