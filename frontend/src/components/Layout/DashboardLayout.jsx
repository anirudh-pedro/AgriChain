// src/components/Layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut,
  Home,
  BarChart3,
  Package,
  Users,
  Truck,
  Shield,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationCenter from '../UI/NotificationCenter';
import Button, { IconButton } from '../UI/Button';

const DashboardLayout = ({ children, title, subtitle, breadcrumbs = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ];

    const roleSpecificItems = {
      farmer: [
        { name: 'My Produce', href: '/produce', icon: Package },
        { name: 'Transactions', href: '/transactions', icon: BarChart3 },
      ],
      distributor: [
        { name: 'Inventory', href: '/inventory', icon: Package },
        { name: 'Suppliers', href: '/suppliers', icon: Users },
        { name: 'Deliveries', href: '/deliveries', icon: Truck },
      ],
      retailer: [
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Orders', href: '/orders', icon: BarChart3 },
        { name: 'Suppliers', href: '/suppliers', icon: Users },
      ],
      consumer: [
        { name: 'Purchases', href: '/purchases', icon: Package },
        { name: 'Favorites', href: '/favorites', icon: Package },
        { name: 'QR Scanner', href: '/scanner', icon: Search },
      ],
      admin: [
        { name: 'Users', href: '/users', icon: Users },
        { name: 'System', href: '/system', icon: Shield },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
      ]
    };

    return [...baseItems, ...(roleSpecificItems[user?.role] || [])];
  };

  const navigationItems = getNavigationItems();

  const Sidebar = ({ mobile = false }) => (
    <div className={`
      ${mobile ? 'fixed inset-0 z-40 flex' : 'hidden lg:flex lg:flex-col lg:w-64'}
    `}>
      {mobile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className={`
        relative flex flex-col flex-1 max-w-xs w-full bg-white border-r border-gray-200
        ${mobile ? 'ml-0' : ''}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AgriChain</span>
          </div>
          
          {mobile && (
            <IconButton
              icon={<X />}
              onClick={() => setSidebarOpen(false)}
              variant="ghost"
              size="sm"
            />
          )}
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
          {navigationItems.map((item) => {
            const isActive = window.location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-green-700 bg-green-50 border-r-2 border-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-green-700" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <a
            href="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
          <a
            href="/help"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Support
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {sidebarOpen && <Sidebar mobile />}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile menu button */}
          <div className="flex items-center space-x-4">
            <IconButton
              icon={<Menu />}
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              className="lg:hidden"
            />

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">
                    Dashboard
                  </a>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {crumb.href ? (
                      <a href={crumb.href} className="text-gray-500 hover:text-gray-700 text-sm">
                        {crumb.name}
                      </a>
                    ) : (
                      <span className="text-gray-900 text-sm font-medium">{crumb.name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Theme Toggle */}
            <IconButton
              icon={isDark ? <Sun /> : <Moon />}
              onClick={toggleTheme}
              variant="ghost"
              tooltip={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            />

            {/* Notifications */}
            <NotificationCenter />

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </a>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Page Header */}
          {(title || subtitle) && (
            <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;