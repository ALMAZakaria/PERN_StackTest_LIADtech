"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.simpleRegisterSchema = void 0;
const zod_1 = require("zod");
exports.simpleRegisterSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    userType: zod_1.z.enum(['FREELANCER', 'COMPANY'], {
        required_error: 'User type is required',
        invalid_type_error: 'User type must be either FREELANCER or COMPANY'
    }),
    companyName: zod_1.z.string().optional(),
    industry: zod_1.z.string().optional(),
    size: zod_1.z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
    description: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    dailyRate: zod_1.z.union([zod_1.z.number().positive(), zod_1.z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0, 'Daily rate must be a positive number')]).optional(),
    availability: zod_1.z.union([zod_1.z.number().min(1).max(168), zod_1.z.string().transform(val => parseInt(val)).refine(val => !isNaN(val) && val >= 1 && val <= 168, 'Availability must be between 1 and 168 hours')]).optional(),
    experience: zod_1.z.union([zod_1.z.number().min(0), zod_1.z.string().transform(val => parseInt(val)).refine(val => !isNaN(val) && val >= 0, 'Experience must be a non-negative number')]).optional(),
    location: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=auth.dto.js.map