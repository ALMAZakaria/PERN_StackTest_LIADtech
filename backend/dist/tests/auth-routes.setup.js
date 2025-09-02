"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_CONSTANTS = exports.teardownTestDatabase = exports.setupTestDatabase = exports.testUtils = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
exports.testUtils = {
    async createTestUser(userData) {
        const hashedPassword = await bcryptjs_1.default.hash(userData.password || 'password123', 12);
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
    generateTestData() {
        return {
            freelancer: {
                firstName: 'John',
                lastName: 'Developer',
                email: 'test-freelancer@example.com',
                password: 'password123',
                userType: 'FREELANCER',
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
                userType: 'COMPANY',
                companyName: 'TechCorp Inc',
                industry: 'Technology',
                companySize: 'MEDIUM'
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
    validateTokenFormat(token) {
        const tokenParts = token.split('.');
        return tokenParts.length === 3 &&
            typeof token === 'string' &&
            token.length > 0;
    },
    extractToken(response) {
        return response.body.data.token;
    },
    createAuthHeader(token) {
        return { Authorization: `Bearer ${token}` };
    }
};
const setupTestDatabase = async () => {
    await exports.testUtils.cleanupTestData();
};
exports.setupTestDatabase = setupTestDatabase;
const teardownTestDatabase = async () => {
    await exports.testUtils.cleanupTestData();
    await prisma.$disconnect();
};
exports.teardownTestDatabase = teardownTestDatabase;
exports.TEST_CONSTANTS = {
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
//# sourceMappingURL=auth-routes.setup.js.map