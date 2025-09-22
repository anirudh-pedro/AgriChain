import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { 
  UserPlus, User, Mail, Phone, Lock, Eye, EyeOff, 
  MapPin, Building, FileText, CreditCard, Truck,
  ShoppingCart, Users
} from 'lucide-react';

const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    role: 'farmer',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    
    // Farmer fields
    name: '',
    aadhaarId: '',
    landLocation: '',
    typeOfProduce: '',
    
    // Distributor/Retailer fields
    businessName: '',
    gstin: '',
    contactPerson: '',
    businessAddress: '',
    licenseNumber: '',
    
    // Consumer fields
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Role validation
      if (!formData.role) newErrors.role = 'Please select a role';
      
      // Email validation
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Mobile validation (Indian format)
      if (!formData.mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number starting with 6-9';
      }
      
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
      }
      
      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2) {
      if (formData.role === 'farmer') {
        // Farmer name validation
        if (!formData.name) {
          newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
          newErrors.name = 'Name can only contain letters and spaces';
        }
        
        // Aadhaar ID validation
        if (!formData.aadhaarId) {
          newErrors.aadhaarId = 'Aadhaar ID is required';
        } else if (!/^\d{12}$/.test(formData.aadhaarId)) {
          newErrors.aadhaarId = 'Aadhaar ID must be exactly 12 digits';
        }
        
        // Land location validation
        if (!formData.landLocation) {
          newErrors.landLocation = 'Land location is required';
        } else if (formData.landLocation.trim().length < 5) {
          newErrors.landLocation = 'Please provide a detailed location (Village, District, State)';
        }
        
        // Type of produce validation
        if (!formData.typeOfProduce) {
          newErrors.typeOfProduce = 'Type of produce is required';
        }
      } else if (formData.role === 'distributor' || formData.role === 'retailer') {
        // Business name validation
        if (!formData.businessName) {
          newErrors.businessName = 'Business name is required';
        } else if (formData.businessName.trim().length < 2) {
          newErrors.businessName = 'Business name must be at least 2 characters long';
        }
        
        // GSTIN validation
        if (!formData.gstin) {
          newErrors.gstin = 'GSTIN is required';
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
          newErrors.gstin = 'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)';
        }
        
        // Contact person validation
        if (!formData.contactPerson) {
          newErrors.contactPerson = 'Contact person is required';
        } else if (formData.contactPerson.trim().length < 2) {
          newErrors.contactPerson = 'Contact person name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.contactPerson)) {
          newErrors.contactPerson = 'Contact person name can only contain letters and spaces';
        }
        
        // Business address validation
        if (!formData.businessAddress) {
          newErrors.businessAddress = 'Business address is required';
        } else if (formData.businessAddress.trim().length < 10) {
          newErrors.businessAddress = 'Please provide a complete business address';
        }
      } else if (formData.role === 'consumer') {
        // Consumer name validation
        if (!formData.fullName) {
          newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
          newErrors.fullName = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
          newErrors.fullName = 'Name can only contain letters and spaces';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data based on role
      let registrationData = {
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.mobile,
        organization: '',
        location: ''
      };

      // Add role-specific data
      if (formData.role === 'farmer') {
        registrationData.name = formData.name;
        registrationData.aadhaarId = formData.aadhaarId;
        registrationData.location = formData.landLocation;
        registrationData.typeOfProduce = formData.typeOfProduce;
      } else if (formData.role === 'distributor' || formData.role === 'retailer') {
        registrationData.name = formData.contactPerson;
        registrationData.organization = formData.businessName;
        registrationData.gstin = formData.gstin;
        registrationData.location = formData.businessAddress;
        registrationData.licenseNumber = formData.licenseNumber;
      } else if (formData.role === 'consumer') {
        registrationData.name = formData.fullName;
      }

      const result = await authService.register(registrationData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer': return <User className="h-5 w-5" />;
      case 'distributor': return <Truck className="h-5 w-5" />;
      case 'retailer': return <ShoppingCart className="h-5 w-5" />;
      case 'consumer': return <Users className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 Select Your Role
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'farmer', label: 'Farmer', icon: <User className="h-5 w-5" />, color: 'from-green-500 to-emerald-500', desc: '🌾 Grow & Harvest' },
            { value: 'distributor', label: 'Distributor', icon: <Truck className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500', desc: '🚛 Transport & Supply' },
            { value: 'retailer', label: 'Retailer', icon: <ShoppingCart className="h-5 w-5" />, color: 'from-purple-500 to-pink-500', desc: '🏪 Sell & Serve' },
            { value: 'consumer', label: 'Consumer', icon: <Users className="h-5 w-5" />, color: 'from-orange-500 to-red-500', desc: '🛒 Buy & Enjoy' }
          ].map(role => (
            <button
              key={role.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
              className={`group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                formData.role === role.value
                  ? `border-transparent bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                  : 'border-gray-200 bg-white/50 text-gray-700 hover:border-gray-300 hover:bg-white/80'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${formData.role === role.value ? 'bg-white/20' : 'bg-gray-100'}`}>
                {role.icon}
              </div>
              <span className="font-bold">{role.label}</span>
              <span className={`text-xs mt-1 ${formData.role === role.value ? 'text-white/90' : 'text-gray-500'}`}>
                {role.desc}
              </span>
              {formData.role === role.value && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        {errors.role && (
          <p className="text-red-500 text-xs mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.role}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            📧 Email Address
          </label>
          <div className="relative group">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 pl-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:bg-white group-hover:border-gray-300"
              placeholder="Enter your email address"
            />
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-2 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
            📱 Mobile Number
          </label>
          <div className="relative group">
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 pl-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:bg-white group-hover:border-gray-300"
              placeholder="Enter 10-digit mobile number"
            />
            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
          </div>
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-2 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.mobile}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="appearance-none relative block w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:bg-white group-hover:border-gray-300"
              placeholder="Create a strong password"
            />
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-2 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            🔐 Confirm Password
          </label>
          <div className="relative group">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 focus:bg-white group-hover:border-gray-300"
              placeholder="Confirm your password"
            />
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-2 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (formData.role === 'farmer') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your full name"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="aadhaarId" className="block text-sm font-medium text-gray-700">
              Aadhaar ID
            </label>
            <div className="mt-1 relative">
              <input
                id="aadhaarId"
                name="aadhaarId"
                type="text"
                required
                value={formData.aadhaarId}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter 12-digit Aadhaar number"
                maxLength="12"
              />
              <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.aadhaarId && <p className="text-red-500 text-xs mt-1">{errors.aadhaarId}</p>}
          </div>

          <div>
            <label htmlFor="landLocation" className="block text-sm font-medium text-gray-700">
              Land Location
            </label>
            <div className="mt-1 relative">
              <input
                id="landLocation"
                name="landLocation"
                type="text"
                required
                value={formData.landLocation}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Village, District, State"
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.landLocation && <p className="text-red-500 text-xs mt-1">{errors.landLocation}</p>}
          </div>

          <div>
            <label htmlFor="typeOfProduce" className="block text-sm font-medium text-gray-700">
              Type of Produce
            </label>
            <div className="mt-1 relative">
              <select
                id="typeOfProduce"
                name="typeOfProduce"
                value={formData.typeOfProduce}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select produce type</option>
                <option value="grains">Grains (Rice, Wheat, etc.)</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="pulses">Pulses & Legumes</option>
                <option value="spices">Spices</option>
                <option value="dairy">Dairy Products</option>
                <option value="other">Other</option>
              </select>
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.typeOfProduce && <p className="text-red-500 text-xs mt-1">{errors.typeOfProduce}</p>}
          </div>
        </div>
      );
    }

    if (formData.role === 'distributor' || formData.role === 'retailer') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <div className="mt-1 relative">
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter business name"
              />
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">
              GSTIN
            </label>
            <div className="mt-1 relative">
              <input
                id="gstin"
                name="gstin"
                type="text"
                required
                value={formData.gstin}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter 15-digit GSTIN"
                maxLength="15"
              />
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <div className="mt-1 relative">
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Contact person name"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
          </div>

          <div>
            <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
              Business Address
            </label>
            <div className="mt-1 relative">
              <textarea
                id="businessAddress"
                name="businessAddress"
                required
                value={formData.businessAddress}
                onChange={handleChange}
                rows="3"
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Complete business address"
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
              License Number (Optional)
            </label>
            <div className="mt-1 relative">
              <input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Trade license number"
              />
              <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      );
    }

    if (formData.role === 'consumer') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your full name"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Consumer Registration</h4>
                <p className="text-sm text-green-700 mt-1">
                  As a consumer, you'll be able to trace the complete journey of your food products 
                  from farm to table using our blockchain-based tracking system.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-40 w-72 h-72 bg-gradient-to-tr from-teal-200 to-green-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-bl from-emerald-100 to-green-200 rounded-full opacity-10 animate-bounce delay-2000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Join AgriChain
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            Step {currentStep} of 2 - {currentStep === 1 ? '✨ Account Details' : '🚀 Profile Information'}
          </p>
        </div>

        {/* Enhanced Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
            <div className="transform transition-all duration-500 ease-in-out">
              {currentStep === 1 ? renderStep1() : renderStep2()}
            </div>

            {errors.submit && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-red-700 text-sm font-medium">{errors.submit}</p>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 flex justify-center py-3 px-4 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ← Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : currentStep === 1 ? (
                  <>
                    Next Step →
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account ✨
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-500 hover:underline transition-colors duration-200"
                >
                  Sign in here →
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;