import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { isAuthenticated, login, error, loading, clearError, getDemoCredentials } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Get demo credentials for testing
  const demoCredentials = getDemoCredentials();

  // Show loading spinner while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error && clearError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // Error is handled by the login function
    }
  };

  const handleDemoLogin = async (role) => {
    const credentials = demoCredentials[role];
    if (credentials) {
      setFormData(credentials);
      try {
        await login(credentials.email, credentials.password);
      } catch (err) {
        // Error is handled by the login function
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to AgriChain
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your blockchain supply chain platform
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Demo Accounts</span>
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showDemoAccounts ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showDemoAccounts && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-blue-800 mb-3">Click any role to auto-login:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(demoCredentials).map(([role, creds]) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role)}
                    className="text-left p-2 bg-white rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                    disabled={loading}
                  >
                    <div className="text-sm font-medium text-blue-900 capitalize">{role}</div>
                    <div className="text-xs text-blue-600">{creds.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center space-y-2">
            <div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
            <div>
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;