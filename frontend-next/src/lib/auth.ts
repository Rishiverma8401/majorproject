import api from './api';

// Helper to get baseURL for social logins
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  return '/api'; // Fallback for SSR
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'NGO_ADMIN' | 'NGO_MEMBER' | 'DONOR' | 'VOLUNTEER';
  organization?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'NGO_ADMIN' | 'DONOR' | 'VOLUNTEER';
  organization?: string;
}

// Helper to check if code is running in browser
const isBrowser = () => typeof window !== 'undefined';

// Auth service for handling authentication
const AuthService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.status);
      const { token, user } = response.data;
      
      if (isBrowser()) {
        // Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User authenticated successfully');
      }
      
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register user
  register: async (userData: RegisterData) => {
    try {
      console.log('Attempting registration with:', userData.email);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.status);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Request password reset
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Validate reset token
  validateResetToken: async (token: string) => {
    try {
      const response = await api.get(`/auth/validate-reset-token?token=${token}`);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
  
  // Reset password using token
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    if (isBrowser()) {
      console.log('Logging out user');
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('User data cleared from localStorage');
        window.location.href = '/auth/login';
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    if (!isBrowser()) return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    if (!isBrowser()) return false;
    return !!localStorage.getItem('token');
  },
  
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      if (isBrowser()) {
        // Update the stored user data
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Social login (Google)
  googleLogin: () => {
    if (isBrowser()) {
      window.location.href = `${getBaseURL()}/auth/google`;
    }
  },
  
  // Social login (GitHub)
  githubLogin: () => {
    if (isBrowser()) {
      window.location.href = `${getBaseURL()}/auth/github`;
    }
  },
  
  // Handle social login callback
  handleSocialCallback: async (provider: string, code: string) => {
    try {
      const response = await api.post(`/auth/${provider}/callback`, { code });
      const { token, user } = response.data;
      
      if (isBrowser()) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { user, token };
    } catch (error) {
      console.error(`${provider} login callback error:`, error);
      throw error;
    }
  },
};

export default AuthService; 