"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearchFiltersSchema = exports.bulkUserActionSchema = exports.createAdminUserSchema = exports.updateProfileSchema = exports.dateOfBirthSchema = exports.emailSchema = exports.nameSchema = exports.phoneSchema = exports.usernameSchema = exports.strongPasswordSchema = exports.validatePhoneNumber = exports.validatePassword = void 0;
const zod_1 = require("zod");
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    return passwordRegex.test(password);
};
exports.validatePassword = validatePassword;
const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};
exports.validatePhoneNumber = validatePhoneNumber;
exports.strongPasswordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .refine((password) => (0, exports.validatePassword)(password), 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
exports.usernameSchema = zod_1.z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');
exports.phoneSchema = zod_1.z
    .string()
    .optional()
    .refine((phone) => !phone || (0, exports.validatePhoneNumber)(phone), 'Invalid phone number format');
exports.nameSchema = zod_1.z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');
exports.emailSchema = zod_1.z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .transform((email) => email.toLowerCase());
exports.dateOfBirthSchema = zod_1.z
    .string()
    .optional()
    .refine((date) => {
    if (!date)
        return true;
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 13 && age <= 120;
}, 'Age must be between 13 and 120 years');
exports.updateProfileSchema = zod_1.z.object({
    firstName: exports.nameSchema.optional(),
    lastName: exports.nameSchema.optional(),
    email: exports.emailSchema.optional(),
    phone: exports.phoneSchema,
    dateOfBirth: exports.dateOfBirthSchema,
}).strict();
exports.createAdminUserSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.strongPasswordSchema,
    firstName: exports.nameSchema,
    lastName: exports.nameSchema,
    role: zod_1.z.enum(['USER', 'ADMIN']).default('USER'),
});
exports.bulkUserActionSchema = zod_1.z.object({
    userIds: zod_1.z.array(zod_1.z.string().cuid('Invalid user ID')).min(1, 'At least one user ID is required'),
    action: zod_1.z.enum(['activate', 'deactivate', 'delete']),
});
exports.userSearchFiltersSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
    isActive: zod_1.z.boolean().optional(),
    createdAfter: zod_1.z.string().datetime().optional(),
    createdBefore: zod_1.z.string().datetime().optional(),
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'firstName', 'lastName', 'email']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=user.validator.js.map