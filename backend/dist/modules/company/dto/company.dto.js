"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCompaniesSchema = exports.updateCompanyProfileSchema = exports.createCompanyProfileSchema = void 0;
const zod_1 = require("zod");
exports.createCompanyProfileSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1, 'Company name is required'),
    industry: zod_1.z.string().min(1, 'Industry is required'),
    size: zod_1.z.enum(['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).default('SMALL'),
    description: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    location: zod_1.z.string().optional(),
});
exports.updateCompanyProfileSchema = exports.createCompanyProfileSchema.partial();
exports.searchCompaniesSchema = zod_1.z.object({
    industry: zod_1.z.string().optional(),
    size: zod_1.z.enum(['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
    location: zod_1.z.string().optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20),
});
//# sourceMappingURL=company.dto.js.map