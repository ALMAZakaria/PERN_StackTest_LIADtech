"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamSchema = exports.getUsersQuerySchema = exports.changePasswordSchema = exports.updateUserSchema = exports.loginUserSchema = exports.createUserSchema = exports.simpleCreateUserSchema = void 0;
const zod_1 = require("zod");
exports.simpleCreateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['user', 'admin', 'moderator']).default('user'),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    role: zod_1.z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required').optional(),
    lastName: zod_1.z.string().min(1, 'Last name is required').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    role: zod_1.z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters'),
});
exports.getUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
    isActive: zod_1.z.string().transform(val => val === 'true').optional(),
});
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Invalid user ID format'),
});
//# sourceMappingURL=user.dto.js.map