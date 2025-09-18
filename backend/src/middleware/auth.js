const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      const cleanToken = token.replace('Bearer ', '');
      return jwt.verify(cleanToken, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Get user from token
  async getUser(token) {
    if (!token) return null;
    
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      return user;
    } catch (error) {
      return null;
    }
  }

  // Middleware to require authentication
  requireAuth(user) {
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }

  // Middleware to require specific role
  requireRole(user, allowedRoles) {
    this.requireAuth(user);
    
    if (!allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }
    return user;
  }

  // Middleware to require admin role
  requireAdmin(user) {
    return this.requireRole(user, ['ADMIN']);
  }

  // Middleware to require admin or auditor role
  requireAdminOrAuditor(user) {
    return this.requireRole(user, ['ADMIN', 'AUDITOR']);
  }
}

module.exports = new AuthService();