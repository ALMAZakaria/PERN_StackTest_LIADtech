"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const originalConsole = { ...console };
(0, globals_1.beforeAll)(async () => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    if (process.env.TEST_DATABASE === 'true') {
        try {
            await prisma.user.deleteMany();
            await prisma.companyProfile.deleteMany();
            await prisma.freelanceProfile.deleteMany();
            await prisma.mission.deleteMany();
            await prisma.application.deleteMany();
            await prisma.rating.deleteMany();
            await prisma.portfolioProject.deleteMany();
            const hashedPassword = await bcryptjs_1.default.hash('demo123', 12);
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
            await prisma.companyProfile.create({
                data: {
                    userId: (await prisma.user.findUnique({ where: { email: 'admin@demo.com' } })).id,
                    companyName: 'Test Company',
                    industry: 'Technology',
                    size: 'SMALL',
                }
            });
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
            await prisma.freelanceProfile.create({
                data: {
                    userId: (await prisma.user.findUnique({ where: { email: 'test-freelancer@example.com' } })).id,
                    skills: ['JavaScript', 'React', 'Node.js'],
                    dailyRate: 100,
                    availability: 40,
                    experience: 3,
                }
            });
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
            await prisma.companyProfile.create({
                data: {
                    userId: (await prisma.user.findUnique({ where: { email: 'test-company@example.com' } })).id,
                    companyName: 'Test Company 2',
                    industry: 'Finance',
                    size: 'MEDIUM',
                }
            });
            await prisma.mission.create({
                data: {
                    title: 'Test Mission',
                    description: 'A test mission for testing purposes',
                    companyId: (await prisma.companyProfile.findFirst({ where: { companyName: 'Test Company' } })).id,
                    requiredSkills: ['JavaScript', 'React'],
                    budget: 1000,
                    duration: 30,
                    status: 'OPEN',
                    isRemote: true,
                }
            });
        }
        catch (error) {
            console.warn('Database setup failed, running tests without database:', error);
        }
    }
});
(0, globals_1.afterAll)(async () => {
    Object.assign(console, originalConsole);
    if (process.env.TEST_DATABASE === 'true') {
        try {
            await prisma.user.deleteMany();
            await prisma.companyProfile.deleteMany();
            await prisma.freelanceProfile.deleteMany();
            await prisma.mission.deleteMany();
            await prisma.application.deleteMany();
            await prisma.rating.deleteMany();
            await prisma.portfolioProject.deleteMany();
        }
        catch (error) {
            console.warn('Database cleanup failed:', error);
        }
    }
    await prisma.$disconnect();
});
global.testUtils = {
    createTestUser: (overrides = {}) => ({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123',
        role: 'user',
        ...overrides
    }),
    getAdminCredentials: () => ({
        email: 'admin@demo.com',
        password: 'demo123'
    }),
    getFreelancerCredentials: () => ({
        email: 'test-freelancer@example.com',
        password: 'demo123'
    }),
    getCompanyCredentials: () => ({
        email: 'test-company@example.com',
        password: 'demo123'
    }),
    extractToken: (authResponse) => {
        return authResponse.body.data.token;
    },
    createAuthHeader: (token) => ({
        Authorization: `Bearer ${token}`
    })
};
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
        }
        else {
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
            token.split('.').length === 3;
        if (pass) {
            return {
                message: () => `expected response not to have a valid JWT token`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected response to have a valid JWT token`,
                pass: false,
            };
        }
    }
});
//# sourceMappingURL=setup.js.map