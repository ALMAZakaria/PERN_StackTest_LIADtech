import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Test utilities
export const testUtils = {
  // Create a test user
  async createTestUser(userData: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: 'USER' | 'ADMIN';
    userType?: 'FREELANCER' | 'COMPANY';
  }) {
    const hashedPassword = await bcrypt.hash(userData.password || 'password123', 12);
    
    return await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName || 'Test',
        lastName: userData.lastName || 'User',
        role: userData.role || 'USER',
        userType: userData.userType || 'FREELANCER',
      }
    });
  },

  // Clean up test data
  async cleanupTestData() {
    await prisma.rating.deleteMany();
    await prisma.application.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.freelanceProfile.deleteMany();
    await prisma.companyProfile.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'test-freelancer@example.com',
            'test-freelancer2@example.com',
            'test-company@example.com',
            'test-company2@example.com',
            'test-admin@example.com',
            'test-user@example.com',
            'duplicate@example.com',
            'security-test@example.com',
            'hash-test@example.com'
          ]
        }
      }
    });
  },

  // Generate test data
  generateTestData() {
    return {
      freelancer: {
        firstName: 'John',
        lastName: 'Developer',
        email: 'test-freelancer@example.com',
        password: 'password123',
        userType: 'FREELANCER' as const,
        skills: ['React', 'TypeScript', 'Node.js'],
        dailyRate: 500,
        availability: 40,
        experience: 5
      },
      company: {
        firstName: 'Sarah',
        lastName: 'Manager',
        email: 'test-company@example.com',
        password: 'password123',
        userType: 'COMPANY' as const,
        companyName: 'TechCorp Inc',
        industry: 'Technology',
        companySize: 'MEDIUM' as const
      },
      invalidData: {
        firstName: 'A',
        lastName: 'B',
        email: 'invalid-email',
        password: '123',
        userType: 'INVALID'
      }
    };
  },

  // Validate JWT token format
  validateTokenFormat(token: string) {
    const tokenParts = token.split('.');
    return tokenParts.length === 3 && 
           typeof token === 'string' && 
           token.length > 0;
  },

  // Extract token from response
  extractToken(response: any) {
    return response.body.data.token;
  },

  // Create authorization header
  createAuthHeader(token: string) {
    return { Authorization: `Bearer ${token}` };
  }
};

// Global test setup
export const setupTestDatabase = async () => {
  await testUtils.cleanupTestData();
};

export const teardownTestDatabase = async () => {
  await testUtils.cleanupTestData();
  await prisma.$disconnect();
};

// Test constants
export const TEST_CONSTANTS = {
  VALID_PASSWORD: 'password123',
  INVALID_PASSWORD: 'wrongpassword',
  TEST_EMAILS: {
    FREELANCER: 'test-freelancer@example.com',
    COMPANY: 'test-company@example.com',
    ADMIN: 'test-admin@example.com',
    USER: 'test-user@example.com'
  },
  EXPECTED_MESSAGES: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User with this email already exists',
    ACCESS_TOKEN_REQUIRED: 'Access token required',
    INVALID_TOKEN: 'Invalid or expired token'
  }
};
