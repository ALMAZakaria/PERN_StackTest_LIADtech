import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
  availability: string;
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
  freelancer?: User;
  company?: User;
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