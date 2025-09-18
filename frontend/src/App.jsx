import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ApolloProvider } from '@apollo/client';
// import client from './utils/apollo';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Page Components
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import SubmitTransactionPage from './pages/Transactions/SubmitTransactionPage';
import BatchUploadPage from './pages/Transactions/BatchUploadPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import UsersPage from './pages/Admin/UsersPage';

import './App.css';

function App() {
  return (
    // <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/submit" element={<SubmitTransactionPage />} />
                  <Route path="/batch-upload" element={<BatchUploadPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  
                  {/* Admin only routes */}
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN']}>
                        <UsersPage />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    // </ApolloProvider>
  );
}

export default App;
