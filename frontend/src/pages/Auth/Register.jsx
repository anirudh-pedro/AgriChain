// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Building, 
  CreditCard, Users, ShoppingCart, UserCheck
} from 'lucide-react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LocationPicker from '../../components/UI/LocationPicker';

const Register = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Role-specific fields
    // Farmer
    aadhaarId: '',
    farmLocation: { address: '', coordinates: null },
    farmSize: '',
    primaryCrops: '',
    
    // Distributor
    companyName: '',
    businessLicense: '',
    warehouseLocation: { address: '', coordinates: null },
    distributionRadius: '',
    
    // Retailer
    storeName: '',
    storeAddress: { address: '', coordinates: null },
    gstNumber: '',
    storeType: 'grocery',
    
    // Consumer
    deliveryAddress: { address: '', coordinates: null },
    preferredPayment: 'card',
    
    // Admin
    adminCode: '',
    department: '',
    employeeId: ''
  });

  const roles = [
    { 
      value: 'farmer', 
      label: 'Farmer', 
      icon: <User className="w-5 h-5" />,
      description: 'Grow and sell agricultural products'
    },
    { 
      value: 'distributor', 
      label: 'Distributor', 
      icon: <Building className="w-5 h-5" />,
      description: 'Distribute products from farms to retailers'
    },
    { 
      value: 'retailer', 
      label: 'Retailer', 
      icon: <ShoppingCart className="w-5 h-5" />,
      description: 'Sell products to end consumers'
    },
    { 
      value: 'consumer', 
      label: 'Consumer', 
      icon: <Users className="w-5 h-5" />,
      description: 'Purchase and trace product origins'
    },
    { 
      value: 'admin', 
      label: 'Admin', 
      icon: <UserCheck className="w-5 h-5" />,
      description: 'Manage platform and users'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationChange = (field, location) => {
    setFormData(prev => ({ ...prev, [field]: location }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCommonFields = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const validateRoleSpecificFields = () => {
    const newErrors = {};

    switch (currentRole) {
      case 'farmer':
        if (!formData.aadhaarId) newErrors.aadhaarId = 'Aadhaar ID is required';
        else if (!/^\d{12}$/.test(formData.aadhaarId)) newErrors.aadhaarId = 'Aadhaar ID must be 12 digits';
        if (!formData.farmLocation.address) newErrors.farmLocation = 'Farm location is required';
        if (!formData.farmSize) newErrors.farmSize = 'Farm size is required';
        if (!formData.primaryCrops) newErrors.primaryCrops = 'Primary crops information is required';
        break;

      case 'distributor':
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.businessLicense) newErrors.businessLicense = 'Business license is required';
        if (!formData.warehouseLocation.address) newErrors.warehouseLocation = 'Warehouse location is required';
        if (!formData.distributionRadius) newErrors.distributionRadius = 'Distribution radius is required';
        break;

      case 'retailer':
        if (!formData.storeName) newErrors.storeName = 'Store name is required';
        if (!formData.storeAddress.address) newErrors.storeAddress = 'Store address is required';
        if (!formData.gstNumber) newErrors.gstNumber = 'GST number is required';
        break;

      case 'consumer':
        if (!formData.deliveryAddress.address) newErrors.deliveryAddress = 'Delivery address is required';
        break;

      case 'admin':
        if (!formData.adminCode) newErrors.adminCode = 'Admin code is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
        break;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const commonErrors = validateCommonFields();
    const roleErrors = validateRoleSpecificFields();
    const allErrors = { ...commonErrors, ...roleErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: currentRole,
        registrationTime: new Date().toISOString(),
        ...Object.keys(formData).reduce((acc, key) => {
          if (!['password', 'confirmPassword'].includes(key) && formData[key]) {
            acc[key] = formData[key];
          }
          return acc;
        }, {})
      };

      localStorage.setItem('agrichain_user', JSON.stringify(userData));
      
      // Show success message and redirect
      alert('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (currentRole) {
      case 'farmer':
        return (
          <div className="space-y-4">
            <Input
              label="Aadhaar ID"
              name="aadhaarId"
              type="text"
              value={formData.aadhaarId}
              onChange={handleInputChange}
              placeholder="Enter 12-digit Aadhaar number"
              error={errors.aadhaarId}
              icon={<CreditCard className="w-5 h-5" />}
              maxLength="12"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Location
              </label>
              <LocationPicker
                value={formData.farmLocation}
                onChange={(location) => handleLocationChange('farmLocation', location)}
                error={errors.farmLocation}
                placeholder="Enter your farm location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Farm Size (acres)"
                name="farmSize"
                type="number"
                value={formData.farmSize}
                onChange={handleInputChange}
                placeholder="e.g., 5.5"
                error={errors.farmSize}
                min="0"
                step="0.1"
              />
              
              <Input
                label="Primary Crops"
                name="primaryCrops"
                type="text"
                value={formData.primaryCrops}
                onChange={handleInputChange}
                placeholder="e.g., Rice, Wheat, Vegetables"
                error={errors.primaryCrops}
              />
            </div>
          </div>
        );

      case 'distributor':
        return (
          <div className="space-y-4">
            <Input
              label="Company Name"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              error={errors.companyName}
              icon={<Building className="w-5 h-5" />}
            />

            <Input
              label="Business License Number"
              name="businessLicense"
              type="text"
              value={formData.businessLicense}
              onChange={handleInputChange}
              placeholder="Enter business license number"
              error={errors.businessLicense}
              icon={<CreditCard className="w-5 h-5" />}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse Location
              </label>
              <LocationPicker
                value={formData.warehouseLocation}
                onChange={(location) => handleLocationChange('warehouseLocation', location)}
                error={errors.warehouseLocation}
                placeholder="Enter warehouse location"
              />
            </div>

            <Input
              label="Distribution Radius (km)"
              name="distributionRadius"
              type="number"
              value={formData.distributionRadius}
              onChange={handleInputChange}
              placeholder="e.g., 50"
              error={errors.distributionRadius}
              min="1"
            />
          </div>
        );

      case 'retailer':
        return (
          <div className="space-y-4">
            <Input
              label="Store Name"
              name="storeName"
              type="text"
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder="Enter store name"
              error={errors.storeName}
              icon={<ShoppingCart className="w-5 h-5" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Address
              </label>
              <LocationPicker
                value={formData.storeAddress}
                onChange={(location) => handleLocationChange('storeAddress', location)}
                error={errors.storeAddress}
                placeholder="Enter store address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GST Number"
                name="gstNumber"
                type="text"
                value={formData.gstNumber}
                onChange={handleInputChange}
                placeholder="Enter GST number"
                error={errors.gstNumber}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Type
                </label>
                <select
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="grocery">Grocery Store</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="organic">Organic Store</option>
                  <option value="wholesale">Wholesale Market</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'consumer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <LocationPicker
                value={formData.deliveryAddress}
                onChange={(location) => handleLocationChange('deliveryAddress', location)}
                error={errors.deliveryAddress}
                placeholder="Enter delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Payment Method
              </label>
              <select
                name="preferredPayment"
                value={formData.preferredPayment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Digital Wallet</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-4">
            <Input
              label="Admin Access Code"
              name="adminCode"
              type="password"
              value={formData.adminCode}
              onChange={handleInputChange}
              placeholder="Enter admin access code"
              error={errors.adminCode}
              icon={<Lock className="w-5 h-5" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Agriculture, Technology"
                error={errors.department}
              />

              <Input
                label="Employee ID"
                name="employeeId"
                type="text"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="Enter employee ID"
                error={errors.employeeId}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriChain</h1>
          <p className="text-gray-600">Create your account and start your journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Role Selection Tabs */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Role</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setCurrentRole(role.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    currentRole === role.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    {role.icon}
                    <span className="text-xs font-medium">{role.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {roles.find(r => r.value === currentRole)?.description}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Common Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors.name}
                icon={<User className="w-5 h-5" />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  icon={<Mail className="w-5 h-5" />}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  error={errors.phone}
                  icon={<Phone className="w-5 h-5" />}
                  maxLength="10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  error={errors.password}
                  icon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  icon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {roles.find(r => r.value === currentRole)?.label} Details
              </h3>
              {renderRoleSpecificFields()}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
              />
              <div className="ml-3 text-sm">
                <p className="text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="px-6 pb-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;