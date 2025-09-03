import { z } from 'zod';
export declare const createCompanyProfileSchema: z.ZodObject<{
    companyName: z.ZodString;
    industry: z.ZodString;
    size: z.ZodDefault<z.ZodEnum<["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]>>;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    companyName: string;
    industry: string;
    size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
    location?: string | undefined;
    description?: string | undefined;
    website?: string | undefined;
}, {
    companyName: string;
    industry: string;
    location?: string | undefined;
    description?: string | undefined;
    size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    website?: string | undefined;
}>;
export type CreateCompanyProfileDto = z.infer<typeof createCompanyProfileSchema>;
export declare const updateCompanyProfileSchema: z.ZodObject<{
    companyName: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodDefault<z.ZodEnum<["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    location?: string | undefined;
    description?: string | undefined;
    companyName?: string | undefined;
    industry?: string | undefined;
    size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    website?: string | undefined;
}, {
    location?: string | undefined;
    description?: string | undefined;
    companyName?: string | undefined;
    industry?: string | undefined;
    size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    website?: string | undefined;
}>;
export type UpdateCompanyProfileDto = z.infer<typeof updateCompanyProfileSchema>;
export declare const searchCompaniesSchema: z.ZodObject<{
    industry: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodEnum<["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]>>;
    location: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    location?: string | undefined;
    industry?: string | undefined;
    size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
}, {
    location?: string | undefined;
    industry?: string | undefined;
    size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type SearchCompaniesDto = z.infer<typeof searchCompaniesSchema>;
export interface CompanyProfileResponse {
    id: string;
    userId: string;
    companyName: string;
    industry: string;
    size: string;
    description?: string;
    website?: string;
    location?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    missions?: MissionSummaryResponse[];
}
export interface MissionSummaryResponse {
    id: string;
    title: string;
    status: string;
    budget: number;
    createdAt: Date;
}
export interface CompanySearchResponse {
    companies: CompanyProfileResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=company.dto.d.ts.map