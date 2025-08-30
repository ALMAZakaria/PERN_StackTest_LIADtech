import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test-freelancer@example.com', 'test-company@example.com']
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a freelancer with profile', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'Alex',
          lastName: 'Developer',
          email: 'test-freelancer@example.com',
          password: 'password123',
          userType: 'FREELANCER',
          skills: ['React', 'Node.js', 'TypeScript'],
          dailyRate: 500,
          availability: 40,
          experience: 5
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.userType).toBe('FREELANCER');
      expect(response.body.data.token).toBeDefined();
    });

    it('should register a company with profile', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'Sarah',
          lastName: 'Manager',
          email: 'test-company@example.com',
          password: 'password123',
          userType: 'COMPANY',
          companyName: 'Test Company',
          industry: 'Technology',
          companySize: 'STARTUP'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.userType).toBe('COMPANY');
      expect(response.body.data.token).toBeDefined();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'Test',
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test-freelancer@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test-freelancer@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
}); 