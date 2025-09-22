import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlockchainProvider } from './context/BlockchainContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AdminRoute from './components/Layout/AdminRoute';

// Authentication Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';

// Produce Management
import ProduceList from './pages/Produce/ProduceList';
import ProduceDetails from './pages/Produce/ProduceDetails';
import AddProduce from './pages/Produce/AddProduce';
import PurchaseProduce from './pages/Produce/PurchaseProduce';

// Traceability
import TraceabilityPage from './pages/Traceability/TraceabilityPage';
import ProductJourney from './pages/Traceability/ProductJourney';

// Transactions
import TransactionHistory from './pages/Transactions/TransactionHistory';
import TransactionDetails from './pages/Transactions/TransactionDetails';
import CreateTransaction from './pages/Transactions/CreateTransaction';

// Analytics
import AnalyticsDashboard from './pages/Analytics/AnalyticsDashboard';

// Profile
import UserProfile from './pages/Profile/UserProfile';
import EditProfile from './pages/Profile/EditProfile';
import Settings from './pages/Profile/Settings';

// Admin Pages
import AdminUserManagement from './pages/Admin/UserManagement';
import AdminTransactionMonitor from './pages/Admin/TransactionMonitor';
import AdminSystemOverview from './pages/Admin/SystemOverview';

// Error Pages
import NotFound from './pages/Error/NotFound';
import Unauthorized from './pages/Error/Unauthorized';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BlockchainProvider>
            <Router>
              <div className="App min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Protected Routes - All Authenticated Users */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/traceability" element={
                    <ProtectedRoute>
                      <TraceabilityPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/traceability/:productId" element={
                    <ProtectedRoute>
                      <ProductJourney />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <TransactionHistory />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/transactions/:id" element={
                    <ProtectedRoute>
                      <TransactionDetails />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <AnalyticsDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile/edit" element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />

                  {/* Farmer-Specific Routes */}
                  <Route path="/add-produce" element={
                    <ProtectedRoute requiredRoles={['farmer']}>
                      <AddProduce />
                    </ProtectedRoute>
                  } />

                  {/* Distributor/Retailer Routes */}
                  <Route path="/produce" element={
                    <ProtectedRoute requiredRoles={['distributor', 'retailer']}>
                      <ProduceList />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/produce/:id" element={
                    <ProtectedRoute requiredRoles={['distributor', 'retailer', 'consumer']}>
                      <ProduceDetails />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/produce/:id/purchase" element={
                    <ProtectedRoute requiredRoles={['distributor', 'retailer']}>
                      <PurchaseProduce />
                    </ProtectedRoute>
                  } />

                  {/* Transaction Creation Routes */}
                  <Route path="/transactions/create" element={
                    <ProtectedRoute requiredRoles={['farmer', 'distributor', 'retailer']}>
                      <CreateTransaction />
                    </ProtectedRoute>
                  } />

                  {/* Admin-Only Routes */}
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AdminUserManagement />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/transactions" element={
                    <AdminRoute>
                      <AdminTransactionMonitor />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/system" element={
                    <AdminRoute>
                      <AdminSystemOverview />
                    </AdminRoute>
                  } />

                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </BlockchainProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;