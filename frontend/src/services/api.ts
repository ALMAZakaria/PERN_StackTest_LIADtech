import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/environment';

// API Configuration

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout - server may be slow to respond');
      error.message = 'Request timeout. Please try again or refresh the page.';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be unavailable');
      error.message = 'Network error. Please check your connection and try again.';
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if not already on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// User Types
export enum UserType {
  FREELANCER = 'FREELANCER',
  COMPANY = 'COMPANY'
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  userType: UserType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Freelance Profile
export interface FreelanceProfile {
  id: string;
  userId: string;
  skills: string[];
  experience: number;
  dailyRate: number;
  availability: number;
  location: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

// Company Profile
export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// Mission
export enum MissionStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum UrgencyLevel {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Mission {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  duration: number;
  location: string;
  isRemote: boolean;
  status: MissionStatus;
  urgency: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
  company?: CompanyProfile;
}

// Application
export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface Application {
  id: string;
  missionId: string;
  freelancerId: string;
  companyId: string;
  proposal: string;
  proposedRate: number;
  estimatedDuration: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  mission?: Mission;
  freelancer?: {
    id: string;
    userId: string;
    skills: string[];
    experience: number;
    dailyRate: number;
    availability: number;
    location: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
    user: User;
  };
  company?: {
    id: string;
    userId: string;
    companyName: string;
    industry: string;
    size: string;
    location: string;
    description: string;
    website?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
  };
}

// Rating
export interface Rating {
  id: string;
  applicationId: string;
  rating: number;
  comment?: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  fromUser?: User;
  toUser?: User;
}

// Portfolio Project
export interface PortfolioProject {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  systemStatus: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  user?: string;
}

// Export the configured API instance
export default api; 