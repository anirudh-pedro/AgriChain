import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Upload, 
  BarChart3, 
  Users, 
  Shield,
  Database
} from 'lucide-react';

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user, hasRole } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: FileText },
    { name: 'Submit Data', href: '/submit', icon: Plus },
    { name: 'Batch Upload', href: '/batch-upload', icon: Upload },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const adminNavigation = [
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  const NavLink = ({ item }) => (
    <Link
      to={item.href}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        isCurrentPath(item.href)
          ? 'bg-blue-100 text-blue-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={onClose}
    >
      <item.icon
        className={`mr-3 flex-shrink-0 h-6 w-6 ${
          isCurrentPath(item.href)
            ? 'text-blue-500'
            : 'text-gray-400 group-hover:text-gray-500'
        }`}
      />
      {item.name}
    </Link>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">AgriChain</h1>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}

          {/* Admin section */}
          {hasRole('ADMIN') && (
            <>
              <div className="pt-6 pb-2">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              {adminNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            AgriChain v1.0.0
            <br />
            Blockchain Data Management
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;