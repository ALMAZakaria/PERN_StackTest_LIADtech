// Test setup and configuration
import { beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Mock console methods to reduce noise during testing
const originalConsole = { ...console };

beforeAll(async () => {
  // Suppress console logs during tests unless explicitly needed
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();

  // Only setup database if we're running database-dependent tests
  if (process.env.TEST_DATABASE === 'true') {
    try {
      // Clean up test database
      await prisma.user.deleteMany();
      await prisma.companyProfile.deleteMany();
      await prisma.freelanceProfile.deleteMany();
      await prisma.mission.deleteMany();
      await prisma.application.deleteMany();
      await prisma.rating.deleteMany();
      await prisma.portfolioProject.deleteMany();

      // Create test admin user
      const hashedPassword = await bcrypt.hash('demo123', 12);
      await prisma.user.create({
        data: {
          email: 'admin@demo.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          userType: 'COMPANY',
          isActive: true,
        }
      });

      // Create test company profile
      await prisma.companyProfile.create({
        data: {
          userId: (await prisma.user.findUnique({ where: { email: 'admin@demo.com' } }))!.id,
          companyName: 'Test Company',
          industry: 'Technology',
          size: 'SMALL',
        }
      });

      // Create test freelancer user
      await prisma.user.create({
        data: {
          email: 'test-freelancer@example.com',
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'Freelancer',
          role: 'USER',
          userType: 'FREELANCER',
          isActive: true,
        }
      });

      // Create test freelance profile
      await prisma.freelanceProfile.create({
        data: {
          userId: (await prisma.user.findUnique({ where: { email: 'test-freelancer@example.com' } }))!.id,
          skills: ['JavaScript', 'React', 'Node.js'],
          dailyRate: 100,
          availability: 40, // Hours per week
          experience: 3,
        }
      });

      // Create test company user
      await prisma.user.create({
        data: {
          email: 'test-company@example.com',
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'Company',
          role: 'USER',
          userType: 'COMPANY',
          isActive: true,
        }
      });

      // Create test company profile
      await prisma.companyProfile.create({
        data: {
          userId: (await prisma.user.findUnique({ where: { email: 'test-company@example.com' } }))!.id,
          companyName: 'Test Company 2',
          industry: 'Finance',
          size: 'MEDIUM',
        }
      });

      // Create test mission
      await prisma.mission.create({
        data: {
          title: 'Test Mission',
          description: 'A test mission for testing purposes',
          companyId: (await prisma.companyProfile.findFirst({ where: { companyName: 'Test Company' } }))!.id,
          requiredSkills: ['JavaScript', 'React'],
          budget: 1000,
          duration: 30,
          status: 'OPEN',
          isRemote: true,
        }
      });
    } catch (error) {
      console.warn('Database setup failed, running tests without database:', error);
    }
  }
});

afterAll(async () => {
  // Restore console methods
  Object.assign(console, originalConsole);

  // Only cleanup database if we're running database-dependent tests
  if (process.env.TEST_DATABASE === 'true') {
    try {
      // Clean up test database
      await prisma.user.deleteMany();
      await prisma.companyProfile.deleteMany();
      await prisma.freelanceProfile.deleteMany();
      await prisma.mission.deleteMany();
      await prisma.application.deleteMany();
      await prisma.rating.deleteMany();
      await prisma.portfolioProject.deleteMany();
    } catch (error) {
      console.warn('Database cleanup failed:', error);
    }
  }

  // Disconnect from database
  await prisma.$disconnect();
});

// Global test utilities
global.testUtils = {
  // Helper to create test user data
  createTestUser: (overrides = {}) => ({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123',
    role: 'user',
    ...overrides
  }),

  // Helper to create admin credentials
  getAdminCredentials: () => ({
    email: 'admin@demo.com',
    password: 'demo123'
  }),

  // Helper to create freelancer credentials
  getFreelancerCredentials: () => ({
    email: 'test-freelancer@example.com',
    password: 'demo123'
  }),

  // Helper to create company credentials
  getCompanyCredentials: () => ({
    email: 'test-company@example.com',
    password: 'demo123'
  }),

  // Helper to extract token from auth response
  extractToken: (authResponse: any) => {
    return authResponse.body.data.token;
  },

  // Helper to create authorization header
  createAuthHeader: (token: string) => ({
    Authorization: `Bearer ${token}`
  })
};

// Extend Jest matchers for API testing
expect.extend({
  toBeValidApiResponse(received) {
    const pass = received && 
                 typeof received.success === 'boolean' &&
                 typeof received.message === 'string';
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid API response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid API response with success and message properties`,
        pass: false,
      };
    }
  },

  toHaveValidToken(received) {
    const token = received.body?.data?.token;
    const pass = token && 
                 typeof token === 'string' &&
                 token.split('.').length === 3; // JWT format
    
    if (pass) {
      return {
        message: () => `expected response not to have a valid JWT token`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have a valid JWT token`,
        pass: false,
      };
    }
  }
});

// Type declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidApiResponse(): R;
      toHaveValidToken(): R;
    }
  }
  
  var testUtils: {
    createTestUser: (overrides?: any) => any;
    getAdminCredentials: () => { email: string; password: string };
    getFreelancerCredentials: () => { email: string; password: string };
    getCompanyCredentials: () => { email: string; password: string };
    extractToken: (authResponse: any) => string;
    createAuthHeader: (token: string) => { Authorization: string };
  };
} 