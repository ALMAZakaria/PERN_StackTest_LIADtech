"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const AppError_1 = require("../../../utils/AppError");
const server_1 = require("../../../config/server");
const error_handler_1 = require("../../../utils/error-handler");
const prisma = new client_1.PrismaClient();
class AuthService {
    generateTokens(userId, role, email, userType) {
        const payload = {
            userId,
            email,
            role: role.toString(),
            userType: userType || 'FREELANCER'
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, server_1.config.JWT_SECRET, { expiresIn: server_1.config.JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign(payload, server_1.config.JWT_REFRESH_SECRET, { expiresIn: server_1.config.JWT_REFRESH_EXPIRES_IN });
        return { accessToken, refreshToken };
    }
    async simpleRegister(userData) {
        const { firstName, lastName, email, password } = userData;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new error_handler_1.ConflictError('User already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, server_1.config.BCRYPT_ROUNDS);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: client_1.Role.USER,
                userType: 'FREELANCER'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                userType: true,
                isActive: true,
                createdAt: true
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, server_1.config.JWT_SECRET, { expiresIn: server_1.config.JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, server_1.config.JWT_REFRESH_SECRET, { expiresIn: server_1.config.JWT_REFRESH_EXPIRES_IN });
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                userType: user.userType,
                isActive: user.isActive,
                createdAt: user.createdAt
            },
            token,
            refreshToken
        };
    }
    async register(userData) {
        const { firstName, lastName, email, password, userType, companyName, industry, companySize, skills, dailyRate, availability, experience } = userData;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new AppError_1.AppError('User with this email already exists', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role: client_1.Role.USER,
                    userType: userType,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    userType: true,
                    isActive: true,
                    createdAt: true,
                }
            });
            if (userType === 'COMPANY' && companyName && industry && companySize) {
                await tx.companyProfile.create({
                    data: {
                        userId: user.id,
                        companyName,
                        industry,
                        size: companySize,
                    }
                });
            }
            else if (userType === 'FREELANCER' && skills && dailyRate && availability && experience !== undefined) {
                await tx.freelanceProfile.create({
                    data: {
                        userId: user.id,
                        skills,
                        dailyRate: new tx.Prisma.Decimal(dailyRate),
                        availability,
                        experience,
                    }
                });
            }
            return user;
        });
        const { accessToken, refreshToken } = this.generateTokens(result.id, result.role, result.email, result.userType);
        return {
            user: {
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                role: result.role,
                userType: result.userType,
                isActive: result.isActive,
                createdAt: result.createdAt,
            },
            token: accessToken,
            refreshToken,
        };
    }
    async login(credentials) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                role: true,
                userType: true,
                isActive: true,
                createdAt: true,
            }
        });
        if (!user) {
            throw new AppError_1.AppError('Invalid email or password', 400);
        }
        if (!user.isActive) {
            throw new AppError_1.AppError('Account is deactivated', 400);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError('Invalid email or password', 400);
        }
        const { accessToken, refreshToken } = this.generateTokens(user.id, user.role, user.email, user.userType);
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                userType: user.userType,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
            token: accessToken,
            refreshToken,
        };
    }
    async logout(token) {
        console.log(`User logged out with token: ${token.substring(0, 20)}...`);
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, server_1.config.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new AppError_1.AppError('Invalid or expired token', 401);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map