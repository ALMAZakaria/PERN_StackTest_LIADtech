import request from 'supertest';
import app from './simple-api';

describe('PERN Stack API Tests', () => {
  let authToken: string;

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Authentication', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should register a new user successfully', async () => {
        const userData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.data.user.email).toBe(userData.email);
        expect(response.body.data.token).toBeDefined();
      });

      it('should reject registration with existing email', async () => {
        const userData = {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'admin@demo.com', // Already exists
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User already exists');
      });

      it('should reject registration with invalid data', async () => {
        const invalidData = {
          firstName: '', // Too short
          lastName: '', // Too short
          email: 'invalid-email', // Invalid email
          password: '123' // Too short
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(invalidData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('POST /api/v1/auth/login', () => {
      it('should login with valid credentials', async () => {
        const credentials = {
          email: 'admin@demo.com',
          password: 'demo123'
        };

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(credentials)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.data.user.email).toBe(credentials.email);
        expect(response.body.data.token).toBeDefined();
        
        // Store token for other tests
        authToken = response.body.data.token;
      });

      it('should reject login with invalid credentials', async () => {
        const credentials = {
          email: 'admin@demo.com',
          password: 'wrongpassword'
        };

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(credentials)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid email or password');
      });

      it('should reject login with non-existent user', async () => {
        const credentials = {
          email: 'nonexistent@example.com',
          password: 'somepassword'
        };

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send(credentials)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid email or password');
      });
    });
  });

  // Test Dashboard Routes
  describe('Dashboard', () => {
    describe('GET /api/v1/dashboard/statistics', () => {
      it('should return dashboard statistics for authenticated user', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/dashboard/statistics')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('totalUsers');
        expect(response.body.data).toHaveProperty('activeUsers');
        expect(response.body.data).toHaveProperty('newUsersToday');
        expect(response.body.data).toHaveProperty('systemStatus');
        expect(typeof response.body.data.totalUsers).toBe('number');
      });

      it('should reject request without authentication', async () => {
        const response = await request(app)
          .get('/api/v1/dashboard/statistics')
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Access token required');
      });
    });

    describe('GET /api/v1/dashboard/activity', () => {
      it('should return recent activities', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/dashboard/activity')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        
        if (response.body.data.length > 0) {
          expect(response.body.data[0]).toHaveProperty('id');
          expect(response.body.data[0]).toHaveProperty('type');
        }
      });

      it('should respect limit parameter', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/dashboard/activity?limit=5')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('User Management', () => {
    describe('GET /api/v1/users', () => {
      it('should return list of users for authenticated user', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
      });

      it('should filter users by search term', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/users?search=admin')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should filter users by role', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/users?role=admin')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should support pagination', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/users?page=1&limit=10')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('POST /api/v1/users/create', () => {
      it('should create new user with admin privileges', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const newUser = {
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'user'
        };

        const response = await request(app)
          .post('/api/v1/users/create')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newUser)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User created successfully');
      });

      it('should reject creation with existing email', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const duplicateUser = {
          firstName: 'Duplicate',
          lastName: 'User',
          email: 'admin@demo.com', // Already exists
          password: 'password123',
          role: 'user'
        };

        const response = await request(app)
          .post('/api/v1/users/create')
          .set('Authorization', `Bearer ${authToken}`)
          .send(duplicateUser)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User with this email already exists');
      });

      it('should reject creation without admin token', async () => {
        // Create a regular user first by registering
        const regularUser = {
          firstName: 'Regular',
          lastName: 'User',
          email: 'regular@example.com',
          password: 'password123'
        };

        await request(app)
          .post('/api/v1/auth/register')
          .send(regularUser);

        // Login as regular user
        const userLogin = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'regular@example.com',
            password: 'password123'
          });

        const userToken = userLogin.body.data.token;

        const newUser = {
          firstName: 'Unauthorized',
          lastName: 'User',
          email: 'unauthorized@example.com',
          password: 'password123',
          role: 'user'
        };

        const response = await request(app)
          .post('/api/v1/users/create')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser)
          .expect(403);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Insufficient permissions');
      });
    });

    describe('GET /api/v1/users/:id', () => {
      it('should return user by ID', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/users/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe('admin@demo.com');
      });

      it('should return 404 for non-existent user', async () => {
        // Ensure we have a valid token
        if (!authToken) {
          const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'admin@demo.com',
              password: 'demo123'
            });
          authToken = loginResponse.body.data.token;
        }

        const response = await request(app)
          .get('/api/v1/users/999999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User not found');
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });

    it('should handle invalid JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid JSON format');
    });
  });

  describe('JWT Token Validation', () => {
    it('should reject invalid token format', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/statistics')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired token');
    });

    it('should reject missing authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/statistics')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should reject malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/statistics')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid authorization header format');
    });
  });
}); 