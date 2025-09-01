import { z } from 'zod';
export declare const simpleRegisterSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}>;
export declare const registerSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    userType: z.ZodEnum<["FREELANCER", "COMPANY"]>;
    companyName: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodEnum<["STARTUP", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]>>;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dailyRate: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>]>>;
    availability: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>]>>;
    experience: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>]>>;
    location: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: "FREELANCER" | "COMPANY";
    companyName?: string | undefined;
    industry?: string | undefined;
    size?: "STARTUP" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    description?: string | undefined;
    website?: string | undefined;
    skills?: string[] | undefined;
    dailyRate?: number | undefined;
    availability?: number | undefined;
    experience?: number | undefined;
    location?: string | undefined;
    bio?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: "FREELANCER" | "COMPANY";
    companyName?: string | undefined;
    industry?: string | undefined;
    size?: "STARTUP" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE" | undefined;
    description?: string | undefined;
    website?: string | undefined;
    skills?: string[] | undefined;
    dailyRate?: string | number | undefined;
    availability?: string | number | undefined;
    experience?: string | number | undefined;
    location?: string | undefined;
    bio?: string | undefined;
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
export interface SimpleRegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'FREELANCER' | 'COMPANY';
    companyName?: string;
    industry?: string;
    size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    description?: string;
    website?: string;
    skills?: string[];
    dailyRate?: number;
    availability?: number;
    experience?: number;
    location?: string;
    bio?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        userType?: string;
        isActive: boolean;
        createdAt: Date;
    };
    token: string;
    refreshToken: string;
}
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=auth.dto.d.ts.map