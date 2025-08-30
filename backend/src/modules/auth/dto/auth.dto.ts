import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['FREELANCER', 'COMPANY'], {
    required_error: 'User type is required',
    invalid_type_error: 'User type must be either FREELANCER or COMPANY'
  }),
  // Optional fields for immediate profile creation
  companyName: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
  skills: z.array(z.string()).optional(),
  dailyRate: z.number().positive().optional(),
  availability: z.number().min(1).max(168).optional(),
  experience: z.number().min(0).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'FREELANCER' | 'COMPANY';
  companyName?: string;
  industry?: string;
  companySize?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  skills?: string[];
  dailyRate?: number;
  availability?: number;
  experience?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType: string;
    isActive: boolean;
    createdAt: Date;
  };
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 