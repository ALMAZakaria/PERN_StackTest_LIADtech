import request from 'supertest';
import app from '../simple-api';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a freelancer with profile', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Alex Developer',
          email: 'new-freelancer@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('new-freelancer@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should register a company with profile', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Sarah Manager',
          email: 'new-company@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('new-company@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
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
          email: 'admin@demo.com',
          password: 'demo123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@demo.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
    });
  });
}); 