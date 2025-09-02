import { z } from 'zod';

// Simple registration schema for tests
export const simpleRegisterSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Full registration schema for the application
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['FREELANCER', 'COMPANY'], {
    required_error: 'User type is required',
    invalid_type_error: 'User type must be either FREELANCER or COMPANY'
  }),
  // Optional fields for immediate profile creation
  companyName: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  skills: z.array(z.string()).optional(),
  dailyRate: z.union([z.number().positive(), z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0, 'Daily rate must be a positive number')]).optional(),
  availability: z.union([z.number().min(1).max(168), z.string().transform(val => parseInt(val)).refine(val => !isNaN(val) && val >= 1 && val <= 168, 'Availability must be between 1 and 168 hours')]).optional(),
  experience: z.union([z.number().min(0), z.string().transform(val => parseInt(val)).refine(val => !isNaN(val) && val >= 0, 'Experience must be a non-negative number')]).optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Simple registration DTO for tests
export interface SimpleRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Full registration DTO for the application
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'FREELANCER' | 'COMPANY';
  companyName?: string;
  industry?: string;
  size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  description?: string;
  website?: string;
  skills?: string[];
  dailyRate?: number;
  availability?: number;
  experience?: number;
  location?: string;
  bio?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    userType?: string;
    isActive: boolean;
    createdAt: Date;
  };
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 