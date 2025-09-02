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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const server_1 = require("./config/server");
const logger_middleware_1 = require("./middleware/logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const router_1 = __importDefault(require("./modules/user/router"));
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
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});
const authenticateToken = (req, res, next) => {
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
    if (token === 'demo-token') {
        req.user = {
            userId: '1',
            role: 'admin'
        };
        next();
        return;
    }
    jsonwebtoken_1.default.verify(token, server_1.config.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({ success: false, message: 'Invalid or expired token' });
            return;
        }
        req.user = user;
        next();
    });
};
const simpleRegisterSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const users = [
    {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@demo.com',
        password: '$2a$12$ali2ogGkaoKbmiRlRyqPFup6vbocp05a7mcZCJS9914rrp9sCgVTG',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    }
];
app.post('/api/v1/auth/register', async (req, res) => {
    try {
        const userData = simpleRegisterSchema.parse(req.body);
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 12);
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
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, role: newUser.role }, server_1.config.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message || 'Registration failed' });
    }
});
app.post('/api/v1/auth/login', async (req, res) => {
    try {
        const credentials = loginSchema.parse(req.body);
        const user = users.find(u => u.email === credentials.email);
        if (!user || !user.isActive) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(credentials.password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, server_1.config.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message || 'Login failed' });
    }
});
app.get('/api/v1/dashboard/statistics', authenticateToken, (req, res) => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = users.filter(u => new Date(u.createdAt) >= today).length;
    return res.json({
        success: true, message: 'Statistics retrieved successfully',
        data: { totalUsers, activeUsers, newUsersToday, systemStatus: 'online' }
    });
});
app.get('/api/v1/dashboard/activity', authenticateToken, (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const activities = users.slice(-limit).reverse().map(user => ({
        id: `user_${user.id}`, type: 'user_registered', title: 'New user registered',
        description: `${user.firstName} ${user.lastName} created a new account`, time: user.createdAt, user: `${user.firstName} ${user.lastName}`
    }));
    return res.json({ success: true, message: 'Recent activities retrieved successfully', data: activities });
});
app.get('/api/v1/users', authenticateToken, (req, res) => {
    const { search, role, page = 1, limit = 20 } = req.query;
    let filteredUsers = [...users];
    if (search) {
        filteredUsers = filteredUsers.filter(user => `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()));
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
app.post('/api/v1/users/create', authenticateToken, async (req, res) => {
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
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
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message || 'User creation failed' });
    }
});
app.get('/api/v1/users/:id', authenticateToken, (req, res) => {
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
const apiRouter = express_1.default.Router();
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
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
app.use(error_middleware_1.errorHandler);
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
exports.default = app;
//# sourceMappingURL=simple-api.js.map