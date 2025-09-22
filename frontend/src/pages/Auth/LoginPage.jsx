import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { isAuthenticated, login, error, loading, clearError, getDemoCredentials } = useAuth();
  const navigate = useNavigate();
  const navigationTriggered = useRef(false);
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
    role: 'farmer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Get demo credentials for testing - memoized to prevent re-calculation
  const demoCredentials = useMemo(() => getDemoCredentials(), [getDemoCredentials]);

  // Handle navigation in useEffect to prevent render loops
  useEffect(() => {
    if (isAuthenticated && !loading && !navigationTriggered.current) {
      navigationTriggered.current = true;
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading]); // Remove navigate from dependencies

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
      // Use emailOrMobile field for login (backend will handle email format)
      await login(formData.emailOrMobile, formData.password);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-green-300 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-teal-300 to-cyan-500 rounded-full opacity-15 animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-teal-400 rotate-45 animate-spin opacity-40" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-8 h-2 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome Back! 🌱
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Sign in to your AgriChain account
            </p>
          </div>

          {/* Demo Accounts Section */}
          <div className="bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800 flex items-center">
                🎯 Demo Accounts
              </span>
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                {showDemoAccounts ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
            
            {showDemoAccounts && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-700 font-medium">✨ Click any role to auto-login:</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(demoCredentials).map(([role, creds]) => (
                    <button
                      key={role}
                      onClick={() => handleDemoLogin(role)}
                      className="group relative text-left p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      disabled={loading}
                    >
                      <div className="text-sm font-bold text-gray-800 capitalize flex items-center">
                        {role === 'farmer' && '🌾'} 
                        {role === 'distributor' && '🚛'} 
                        {role === 'retailer' && '🏪'} 
                        {role === 'consumer' && '🛒'} 
                        {role === 'admin' && '👑'}
                        <span className="ml-2">{role}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{creds.email}</div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Login Form */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 animate-shake">
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="emailOrMobile" className="block text-sm font-bold text-gray-700 mb-3">
                    📧 Email or Mobile Number
                  </label>
                  <div className="relative group">
                    <input
                      id="emailOrMobile"
                      name="emailOrMobile"
                      type="text"
                      required
                      value={formData.emailOrMobile}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-4 pl-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white group-hover:border-gray-300 text-lg"
                      placeholder="Enter email or mobile number"
                    />
                    <Mail className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-3">
                    👤 Select Your Role
                  </label>
                  <div className="relative group">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-4 pl-12 pr-4 border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white group-hover:border-gray-300 text-lg font-semibold cursor-pointer"
                    >
                      <option value="farmer">🌾 Farmer</option>
                      <option value="distributor">🚛 Distributor</option>
                      <option value="retailer">🏪 Retailer</option>
                      <option value="consumer">🛒 Consumer</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                    <User className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3">
                    🔒 Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white group-hover:border-gray-300 text-lg"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-6 w-6 mr-3" />
                    <span>Sign in to AgriChain</span>
                  </>
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <div className="text-center space-y-4 pt-4">
                <div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors duration-200"
                  >
                    🔑 Forgot your password?
                  </Link>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="font-bold text-green-600 hover:text-green-700 hover:underline transition-colors duration-200"
                    >
                      Sign up here! 🚀
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;