import api, { ApiResponse, AuthResponse, User, UserType } from './api';

// Import store to dispatch actions
import { store } from '../state/store';
import { setUser, clearAuth } from '../state/slices/slice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  // Optional profile-specific fields
  skills?: string[];
  experience?: number;
  dailyRate?: number;
  availability?: string;
  location?: string;
  bio?: string;
  companyName?: string;
  industry?: string;
  size?: string;
  description?: string;
  website?: string;
}

class AuthService {

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { user, token, refreshToken } = response.data.data;
        
        // Store user data and tokens in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Normalize role to uppercase for consistency
        const userForRedux = {
          ...user,
          role: user.role.toUpperCase() // Normalize to 'ADMIN', 'MODERATOR', 'USER'
        };
        
        // Update Redux state
        store.dispatch(setUser({ user: userForRedux, token }));
        
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Use full registration endpoint (saves to database with profile data)
      const fullUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        ...(userData.userType === 'FREELANCER' && {
          skills: userData.skills || [],
          experience: userData.experience || 0,
          dailyRate: userData.dailyRate || 0,
          availability: userData.availability || '',
          location: userData.location || '',
          bio: userData.bio || ''
        }),
        ...(userData.userType === 'COMPANY' && {
          companyName: userData.companyName || '',
          industry: userData.industry || '',
          companySize: userData.size || 'STARTUP',
          description: userData.description || '',
          website: userData.website || ''
        })
      };
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register-full', fullUserData);
      
      if (response.data.success && response.data.data) {
        const { user, token, refreshToken } = response.data.data;
        
        // Store user data and tokens in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Normalize role to uppercase for consistency
        const userForRedux = {
          ...user,
          role: user.role.toUpperCase() // Normalize to 'ADMIN', 'MODERATOR', 'USER'
        };
        
        // Update Redux state
        store.dispatch(setUser({ user: userForRedux, token }));
        
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Update Redux state
      store.dispatch(clearAuth());
    }
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService; 