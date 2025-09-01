import { z } from 'zod';

// Simple user creation DTO for tests
export const simpleCreateUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
});

export type SimpleCreateUserDto = z.infer<typeof simpleCreateUserSchema>;

// User registration DTO
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// User login DTO
export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;

// User update DTO
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Change password DTO
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

// User query params
export const getUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
});

export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>;

// User ID param
export const userIdParamSchema = z.object({
  id: z.string().cuid('Invalid user ID format'),
});

export type UserIdParamDto = z.infer<typeof userIdParamSchema>;

// User response DTO (without password)
export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 