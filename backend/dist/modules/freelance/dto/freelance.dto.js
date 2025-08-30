"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePortfolioProjectSchema = exports.createPortfolioProjectSchema = exports.searchFreelanceProfilesSchema = exports.updateFreelanceProfileSchema = exports.createFreelanceProfileSchema = void 0;
const zod_1 = require("zod");
exports.createFreelanceProfileSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.string()).min(1, 'At least one skill is required'),
    dailyRate: zod_1.z.number().positive('Daily rate must be positive'),
    availability: zod_1.z.number().min(1).max(168, 'Availability must be between 1 and 168 hours per week'),
    bio: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    experience: zod_1.z.number().min(0, 'Experience must be non-negative'),
});
exports.updateFreelanceProfileSchema = exports.createFreelanceProfileSchema.partial();
exports.searchFreelanceProfilesSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    minRate: zod_1.z.number().positive().optional(),
    maxRate: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().optional(),
    minExperience: zod_1.z.number().min(0).optional(),
    availability: zod_1.z.number().min(1).max(168).optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20),
});
exports.createPortfolioProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    technologies: zod_1.z.array(zod_1.z.string()).min(1, 'At least one technology is required'),
    imageUrl: zod_1.z.string().url().optional(),
    projectUrl: zod_1.z.string().url().optional(),
    githubUrl: zod_1.z.string().url().optional(),
});
exports.updatePortfolioProjectSchema = exports.createPortfolioProjectSchema.partial();
//# sourceMappingURL=freelance.dto.js.map