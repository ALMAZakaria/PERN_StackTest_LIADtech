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
const prisma = new client_1.PrismaClient();
class AuthService {
    generateTokens(userId, role) {
        const payload = { userId, role: role.toString() };
        const accessToken = jsonwebtoken_1.default.sign(payload, server_1.config.JWT_SECRET, { expiresIn: server_1.config.JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign(payload, server_1.config.JWT_REFRESH_SECRET, { expiresIn: server_1.config.JWT_REFRESH_EXPIRES_IN });
        return { accessToken, refreshToken };
    }
    async register(userData) {
        const { name, email, password } = userData;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new AppError_1.AppError('User with this email already exists', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: client_1.Role.USER,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        });
        const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);
        return {
            user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
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
        const { accessToken, refreshToken } = this.generateTokens(user.id, user.role);
        return {
            user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                role: user.role,
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