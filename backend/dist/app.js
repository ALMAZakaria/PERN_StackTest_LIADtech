"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const server_1 = require("./config/server");
const logger_middleware_1 = require("./middleware/logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const response_1 = require("./utils/response");
const router_1 = __importDefault(require("./modules/user/router"));
const auth_router_1 = __importDefault(require("./modules/auth/router/auth.router"));
const dashboard_router_1 = __importDefault(require("./modules/dashboard/router/dashboard.router"));
const freelance_router_1 = __importDefault(require("./modules/freelance/router/freelance.router"));
const mission_router_1 = __importDefault(require("./modules/mission/router/mission.router"));
const company_router_1 = __importDefault(require("./modules/company/router/company.router"));
const skills_router_1 = __importDefault(require("./modules/skills/skills.router"));
const portfolio_router_1 = __importDefault(require("./modules/portfolio/portfolio.router"));
const application_router_1 = __importDefault(require("./modules/application/application.router"));
const rating_router_1 = __importDefault(require("./modules/rating/rating.router"));
const notification_router_1 = __importDefault(require("./modules/notification/notification.router"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = server_1.config.CORS_ORIGIN.split(',').map(origin => origin.trim());
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
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
    maxAge: 86400,
};
app.use((0, cors_1.default)(corsOptions));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: server_1.config.RATE_LIMIT_WINDOW_MS,
    max: server_1.config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
app.use(logger_middleware_1.requestLogger);
app.use(logger_middleware_1.securityLogger);
app.get('/health', (req, res) => {
    response_1.ResponseUtil.success(res, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: server_1.config.NODE_ENV,
    }, 'Server is healthy');
});
const apiRouter = express_1.default.Router();
apiRouter.use('/auth', auth_router_1.default);
apiRouter.use('/users', router_1.default);
apiRouter.use('/dashboard', dashboard_router_1.default);
apiRouter.use('/freelance', freelance_router_1.default);
apiRouter.use('/missions', mission_router_1.default);
apiRouter.use('/company', company_router_1.default);
apiRouter.use('/skills', skills_router_1.default);
apiRouter.use('/portfolio', portfolio_router_1.default);
apiRouter.use('/applications', application_router_1.default);
apiRouter.use('/ratings', rating_router_1.default);
apiRouter.use('/notifications', notification_router_1.default);
app.use(`/api/${server_1.config.API_VERSION}`, apiRouter);
if (server_1.config.SWAGGER_ENABLED) {
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
                    url: `http://localhost:${server_1.config.PORT}/api/${server_1.config.API_VERSION}`,
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
    const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
}
app.use('*', (req, res) => {
    response_1.ResponseUtil.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map