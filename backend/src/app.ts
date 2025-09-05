import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { config } from './config/server';
import { requestLogger, securityLogger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { ResponseUtil } from './utils/response';

// Import route modules
import userRoutes from './modules/user/router';
import authRoutes from './modules/auth/router/auth.router';
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
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // Log blocked origins for debugging
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
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

// Root endpoint
app.get('/', (req, res) => {
  ResponseUtil.success(res, {
    message: 'Welcome to PERN Stack Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    endpoints: {
      health: '/health',
      api: `/api/${config.API_VERSION}`,
      documentation: '/api-docs',
      auth: `/api/${config.API_VERSION}/auth`,
      users: `/api/${config.API_VERSION}/users`,
      dashboard: `/api/${config.API_VERSION}/dashboard`,
      freelance: `/api/${config.API_VERSION}/freelance`,
      missions: `/api/${config.API_VERSION}/missions`,
      company: `/api/${config.API_VERSION}/company`,
      skills: `/api/${config.API_VERSION}/skills`,
      portfolio: `/api/${config.API_VERSION}/portfolio`,
      applications: `/api/${config.API_VERSION}/applications`,
      ratings: `/api/${config.API_VERSION}/ratings`,
      notifications: `/api/${config.API_VERSION}/notifications`
    }
  }, 'API is running successfully');
});

// Health check endpoint
app.get('/health', (req, res) => {
  ResponseUtil.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  }, 'Server is healthy');
});

// Status endpoint for monitoring
app.get('/status', (req, res) => {
  ResponseUtil.success(res, {
    status: 'operational',
    service: 'pern-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: '1.0.0'
  }, 'Service is operational');
});

// API routes
const apiRouter = express.Router();

// Mount module routes
apiRouter.use('/auth', authRoutes);
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

// Swagger documentation
if (config.SWAGGER_ENABLED) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'PERN Stack API',
        version: '1.0.0',
        description: 'A comprehensive PERN stack API with TypeScript',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      servers: [
        {
          url: `https://pern-stacktest-liadtech-1.onrender.com/api/${config.API_VERSION}`,
          description: 'Production server',
        },
        {
          url: `http://localhost:${config.PORT}/api/${config.API_VERSION}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
          apis: ['./src/modules/*/router/*.ts', './src/modules/*/*.ts', './src/app.ts'],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 404 handler for undefined routes
app.use('*', (req, res) => {
  ResponseUtil.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
});

// Global error handler (must be last)
app.use(errorHandler);

export default app; 