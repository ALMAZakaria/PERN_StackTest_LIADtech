"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    userType: zod_1.z.enum(['FREELANCER', 'COMPANY'], {
        required_error: 'User type is required',
        invalid_type_error: 'User type must be either FREELANCER or COMPANY'
    }),
    companyName: zod_1.z.string().optional(),
    industry: zod_1.z.string().optional(),
    companySize: zod_1.z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    dailyRate: zod_1.z.number().positive().optional(),
    availability: zod_1.z.number().min(1).max(168).optional(),
    experience: zod_1.z.number().min(0).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=auth.dto.js.map