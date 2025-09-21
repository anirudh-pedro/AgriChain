// Real authentication service for connecting to MongoDB backend
class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    this.graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
    
    // Keep mock users as fallback for development
    this.mockUsers = [
      {
        id: '1',
        username: 'farmer1',
        email: 'farmer@test.com',
        password: 'password123',
        role: 'farmer',
        name: 'John Smith',
        organization: 'Smith Organic Farms',
        location: 'California, USA'
      },
      {
        id: '2',
        username: 'distributor1',
        email: 'distributor@test.com',
        password: 'password123',
        role: 'distributor',
        name: 'Jane Wilson',
        organization: 'Fresh Logistics Co.',
        location: 'Texas, USA'
      },
      {
        id: '3',
        username: 'retailer1',
        email: 'retailer@test.com',
        password: 'password123',
        role: 'retailer',
        name: 'Mike Johnson',
        organization: 'Green Market Store',
        location: 'New York, USA'
      },
      {
        id: '4',
        username: 'consumer1',
        email: 'consumer@test.com',
        password: 'password123',
        role: 'consumer',
        name: 'Sarah Davis',
        organization: null,
        location: 'Florida, USA'
      },
      {
        id: '5',
        username: 'admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        organization: 'AgriChain Platform',
        location: 'Global'
      }
    ];
  }

  // Check if backend is available
  async checkBackendConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.log('Backend not available, using mock authentication');
      return false;
    }
  }

  // Login with real API or fallback to mock
  async login(email, password) {
    const isBackendAvailable = await this.checkBackendConnection();

    if (isBackendAvailable) {
      return this.loginWithAPI(email, password);
    } else {
      return this.loginWithMock(email, password);
    }
  }

  // Real API login using GraphQL
  async loginWithAPI(email, password) {
    try {
      const loginMutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            success
            message
            token
            user {
              id
              username
              email
              role
              name
              organization
              location
            }
          }
        }
      `;

      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: loginMutation,
          variables: { 
            input: { 
              email, 
              password 
            } 
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const loginResult = data.data.login;

      if (loginResult.success) {
        // Store in localStorage
        localStorage.setItem('authToken', loginResult.token);
        localStorage.setItem('user', JSON.stringify(loginResult.user));
        
        return {
          success: true,
          user: loginResult.user,
          token: loginResult.token,
          message: loginResult.message
        };
      } else {
        throw new Error(loginResult.message);
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // Fallback mock login
  async loginWithMock(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.mockUsers.find(
          u => (u.email === email || u.username === email) && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const token = this.generateMockToken(userWithoutPassword);
          
          // Store in localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          
          resolve({
            success: true,
            user: userWithoutPassword,
            token,
            message: 'Login successful (mock mode)'
          });
        } else {
          reject({
            success: false,
            message: 'Invalid email or password'
          });
        }
      }, 1000); // Simulate network delay
    });
  }

  // Register with real API or fallback to mock
  async register(userData) {
    const isBackendAvailable = await this.checkBackendConnection();

    if (isBackendAvailable) {
      return this.registerWithAPI(userData);
    } else {
      return this.registerWithMock(userData);
    }
  }

  // Real API registration using GraphQL
  async registerWithAPI(userData) {
    try {
      const registerMutation = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            success
            message
            token
            user {
              id
              username
              email
              role
              name
              organization
              location
            }
          }
        }
      `;

      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: registerMutation,
          variables: { input: userData }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const registerResult = data.data.register;

      if (registerResult.success) {
        // Store in localStorage
        localStorage.setItem('authToken', registerResult.token);
        localStorage.setItem('user', JSON.stringify(registerResult.user));
        
        return {
          success: true,
          user: registerResult.user,
          token: registerResult.token,
          message: registerResult.message
        };
      } else {
        throw new Error(registerResult.message);
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // Fallback mock registration
  async registerWithMock(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = this.mockUsers.find(
          u => u.email === userData.email || u.username === userData.username
        );

        if (existingUser) {
          reject({
            success: false,
            message: 'User already exists with this email or username'
          });
          return;
        }

        // Create new user
        const newUser = {
          id: (this.mockUsers.length + 1).toString(),
          ...userData,
          role: userData.role || 'consumer' // Default role
        };

        this.mockUsers.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        const token = this.generateMockToken(userWithoutPassword);
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        resolve({
          success: true,
          user: userWithoutPassword,
          token,
          message: 'Registration successful (mock mode)'
        });
      }, 1000);
    });
  }

  // Logout (works with both real API and mock)
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get current token from localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    if (!token || !user) {
      return false;
    }

    // For mock tokens, just check if they exist
    if (token.startsWith('mock_token_')) {
      return true;
    }

    // For real JWT tokens, validate expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }

  // Validate token with backend
  async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    // For mock tokens, return true
    if (token.startsWith('mock_token_')) {
      return true;
    }

    const isBackendAvailable = await this.checkBackendConnection();
    if (!isBackendAvailable) {
      return true; // Assume valid in mock mode
    }

    try {
      const validateQuery = `
        query ValidateToken {
          validateToken {
            valid
            user {
              id
              username
              email
              role
              name
              organization
              location
            }
          }
        }
      `;

      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: validateQuery
        }),
      });

      const data = await response.json();
      
      if (data.errors) {
        return false;
      }

      const result = data.data.validateToken;
      
      if (result.valid) {
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Generate mock JWT-like token for testing
  generateMockToken(user) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    
    return `mock_token_${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.mock_signature`;
  }

  // Get demo credentials for testing
  getDemoCredentials() {
    return this.mockUsers.map(user => ({
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name,
      organization: user.organization
    }));
  }

  // Check user role
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = {
      'admin': ['admin', 'farmer', 'distributor', 'retailer', 'consumer'],
      'farmer': ['farmer'],
      'distributor': ['distributor'],
      'retailer': ['retailer'],
      'consumer': ['consumer']
    };
    
    return roleHierarchy[user.role]?.includes(requiredRole) || false;
  }

  // Update user profile
  async updateProfile(updatedData) {
    const isBackendAvailable = await this.checkBackendConnection();

    if (isBackendAvailable) {
      return this.updateProfileWithAPI(updatedData);
    } else {
      return this.updateProfileWithMock(updatedData);
    }
  }

  // Real API profile update
  async updateProfileWithAPI(updatedData) {
    try {
      const token = this.getToken();
      const updateMutation = `
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            success
            message
            user {
              id
              username
              email
              role
              name
              organization
              location
            }
          }
        }
      `;

      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: updateMutation,
          variables: { input: updatedData }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const updateResult = data.data.updateProfile;

      if (updateResult.success) {
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updateResult.user));
        
        return {
          success: true,
          user: updateResult.user,
          message: updateResult.message
        };
      } else {
        throw new Error(updateResult.message);
      }
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Profile update failed'
      };
    }
  }

  // Mock profile update
  async updateProfileWithMock(updatedData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          reject({
            success: false,
            message: 'Not authenticated'
          });
          return;
        }

        const updatedUser = { ...currentUser, ...updatedData };
        
        // Update in mock users array
        const userIndex = this.mockUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...updatedData };
        }
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        resolve({
          success: true,
          user: updatedUser,
          message: 'Profile updated successfully (mock mode)'
        });
      }, 1000);
    });
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;