import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    userType: z.ZodEnum<["FREELANCER", "COMPANY"]>;
    companyName: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    companySize: z.ZodOptional<z.ZodEnum<["STARTUP", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]>>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dailyRate: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodNumber>;
    experience: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: "FREELANCER" | "COMPANY";
    companyName?: string | undefined;
    industry?: string | undefined;
    companySize?: "STARTUP" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    skills?: string[] | undefined;
    dailyRate?: number | undefined;
    availability?: number | undefined;
    experience?: number | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: "FREELANCER" | "COMPANY";
    companyName?: string | undefined;
    industry?: string | undefined;
    companySize?: "STARTUP" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    skills?: string[] | undefined;
    dailyRate?: number | undefined;
    availability?: number | undefined;
    experience?: number | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'FREELANCER' | 'COMPANY';
    companyName?: string;
    industry?: string;
    companySize?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    skills?: string[];
    dailyRate?: number;
    availability?: number;
    experience?: number;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        userType: string;
        isActive: boolean;
        createdAt: Date;
    };
    token: string;
    refreshToken: string;
}
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=auth.dto.d.ts.map