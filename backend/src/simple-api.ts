import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { config } from './config/server';
import { requestLogger, securityLogger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { ResponseUtil } from './utils/response';

// Import route modules
import userRoutes from './modules/user/router';
import dashboardRoutes from './modules/dashboard/router/dashboard.router';
import freelanceRoutes from './modules/freelance/router/freelance.router';
import missionRoutes from './modules/mission/router/mission.router';
import companyRoutes from './modules/company/router/company.router';
import skillsRoutes from './modules/skills/skills.router';
import portfolioRoutes from './modules/portfolio/portfolio.router';
import applicationRoutes from './modules/application/application.router';
import ratingRoutes from './modules/rating/rating.router';
import notificationRoutes from './modules/notification/notification.router';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = config.CORS_ORIGIN.split(',').map(origin => origin.trim());
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(requestLogger);
app.use(securityLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Simple auth middleware for testing
interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: string;
    role: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: express.Response, next: any): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ success: false, message: 'Access token required' });
    return;
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Invalid authorization header format' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Access token required' });
    return;
  }

  jwt.verify(token, config.JWT_SECRET, (err: any, user: any): void => {
    if (err) {
      res.status(401).json({ success: false, message: 'Invalid or expired token' });
      return;
    }
    req.user = user;
    next();
  });
};

// Simple validation schemas for testing
const simpleRegisterSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// In-memory data store for testing
const users: any[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@demo.com',
    password: '$2a$12$ali2ogGkaoKbmiRlRyqPFup6vbocp05a7mcZCJS9914rrp9sCgVTG', // demo123
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Simple auth routes for testing
app.post('/api/v1/auth/register', async (req: express.Request, res: express.Response) => {
  try {
    const userData = simpleRegisterSchema.parse(req.body);
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = {
      id: String(users.length + 1),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword, 
      role: 'user', 
      isActive: true,
      createdAt: new Date(), 
      updatedAt: new Date()
    };
    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, config.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      success: true, message: 'User registered successfully',
      data: { 
        user: { 
          id: newUser.id, 
          firstName: newUser.firstName, 
          lastName: newUser.lastName, 
          email: newUser.email, 
          role: newUser.role 
        }, 
        token 
      }
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Registration failed' });
  }
});

app.post('/api/v1/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const user = users.find(u => u.email === credentials.email);
    if (!user || !user.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true, message: 'Login successful',
      data: { 
        user: { 
          id: user.id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email, 
          role: user.role 
        }, 
        token 
      }
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Login failed' });
  }
});

// Simple dashboard routes for testing
app.get('/api/v1/dashboard/statistics', authenticateToken, (req: AuthenticatedRequest, res: express.Response) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const newUsersToday = users.filter(u => new Date(u.createdAt) >= today).length;

  return res.json({
    success: true, message: 'Statistics retrieved successfully',
    data: { totalUsers, activeUsers, newUsersToday, systemStatus: 'online' }
  });
});

app.get('/api/v1/dashboard/activity', authenticateToken, (req: AuthenticatedRequest, res: express.Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const activities = users.slice(-limit).reverse().map(user => ({
    id: `user_${user.id}`, type: 'user_registered', title: 'New user registered',
    description: `${user.firstName} ${user.lastName} created a new account`, time: user.createdAt, user: `${user.firstName} ${user.lastName}`
  }));

  return res.json({ success: true, message: 'Recent activities retrieved successfully', data: activities });
});

// Simple user routes for testing
app.get('/api/v1/users', authenticateToken, (req: AuthenticatedRequest, res: express.Response) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  let filteredUsers = [...users];

  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes((search as string).toLowerCase()) ||
      user.email.toLowerCase().includes((search as string).toLowerCase())
    );
  }

  if (role && role !== '') {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return res.json({
    success: true, message: 'Users retrieved successfully',
    data: paginatedUsers.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))
  });
});

app.post('/api/v1/users/create', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const requestingUser = users.find(u => u.id === req.user?.userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const { firstName, lastName, email, password, role } = req.body;
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: String(users.length + 1), firstName, lastName, email, password: hashedPassword,
      role: role || 'user', isActive: true, createdAt: new Date(), updatedAt: new Date()
    };
    users.push(newUser);

    return res.status(201).json({
      success: true, message: 'User created successfully', data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'User creation failed' });
  }
});

app.get('/api/v1/users/:id', authenticateToken, (req: AuthenticatedRequest, res: express.Response) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true, message: 'User retrieved successfully', data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// API routes
const apiRouter = express.Router();

// Mount module routes
apiRouter.use('/users', userRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/freelance', freelanceRoutes);
apiRouter.use('/missions', missionRoutes);
apiRouter.use('/company', companyRoutes);
apiRouter.use('/skills', skillsRoutes);
apiRouter.use('/portfolio', portfolioRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/ratings', ratingRoutes);
apiRouter.use('/notifications', notificationRoutes);

// Mount API routes with version prefix
app.use(`/api/${config.API_VERSION}`, apiRouter);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Health Check: http://localhost:${PORT}/health`);
    console.log(`\n🔐 Demo Credentials:`);
    console.log(`   Email: admin@demo.com`);
    console.log(`   Password: demo123`);
  });
}

export default app; 