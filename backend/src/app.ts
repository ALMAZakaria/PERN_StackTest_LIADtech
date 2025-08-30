import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { config } from './config/server';
import { requestLogger } from './middleware/logger.middleware';
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

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

// Health check endpoint
app.get('/health', (req, res) => {
  ResponseUtil.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  }, 'Server is healthy');
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
    apis: ['./src/modules/*/router/*.ts', './src/modules/*/*.ts'],
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