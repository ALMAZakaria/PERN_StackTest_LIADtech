import { z } from 'zod';
export declare const createFreelanceProfileSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodString, "many">;
    dailyRate: z.ZodNumber;
    availability: z.ZodNumber;
    bio: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    experience: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    skills: string[];
    dailyRate: number;
    availability: number;
    experience: number;
    bio?: string | undefined;
    location?: string | undefined;
}, {
    skills: string[];
    dailyRate: number;
    availability: number;
    experience: number;
    bio?: string | undefined;
    location?: string | undefined;
}>;
export type CreateFreelanceProfileDto = z.infer<typeof createFreelanceProfileSchema>;
export declare const updateFreelanceProfileSchema: z.ZodObject<{
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dailyRate: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodNumber>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    experience: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    skills?: string[] | undefined;
    dailyRate?: number | undefined;
    availability?: number | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    experience?: number | undefined;
}, {
    skills?: string[] | undefined;
    dailyRate?: number | undefined;
    availability?: number | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    experience?: number | undefined;
}>;
export type UpdateFreelanceProfileDto = z.infer<typeof updateFreelanceProfileSchema>;
export declare const searchFreelanceProfilesSchema: z.ZodObject<{
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    minRate: z.ZodOptional<z.ZodNumber>;
    maxRate: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    minExperience: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    skills?: string[] | undefined;
    availability?: number | undefined;
    location?: string | undefined;
    minRate?: number | undefined;
    maxRate?: number | undefined;
    minExperience?: number | undefined;
}, {
    skills?: string[] | undefined;
    availability?: number | undefined;
    location?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    minRate?: number | undefined;
    maxRate?: number | undefined;
    minExperience?: number | undefined;
}>;
export type SearchFreelanceProfilesDto = z.infer<typeof searchFreelanceProfilesSchema>;
export declare const createPortfolioProjectSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    technologies: z.ZodArray<z.ZodString, "many">;
    imageUrl: z.ZodOptional<z.ZodString>;
    projectUrl: z.ZodOptional<z.ZodString>;
    githubUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string | undefined;
    projectUrl?: string | undefined;
    githubUrl?: string | undefined;
}, {
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string | undefined;
    projectUrl?: string | undefined;
    githubUrl?: string | undefined;
}>;
export type CreatePortfolioProjectDto = z.infer<typeof createPortfolioProjectSchema>;
export declare const updatePortfolioProjectSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    projectUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    githubUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    technologies?: string[] | undefined;
    imageUrl?: string | undefined;
    projectUrl?: string | undefined;
    githubUrl?: string | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    technologies?: string[] | undefined;
    imageUrl?: string | undefined;
    projectUrl?: string | undefined;
    githubUrl?: string | undefined;
}>;
export type UpdatePortfolioProjectDto = z.infer<typeof updatePortfolioProjectSchema>;
export interface FreelanceProfileResponse {
    id: string;
    userId: string;
    skills: string[];
    dailyRate: number;
    availability: number;
    bio?: string;
    location?: string;
    experience: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    portfolioProjects?: PortfolioProjectResponse[];
}
export interface PortfolioProjectResponse {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string;
    projectUrl?: string;
    githubUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface FreelanceSearchResponse {
    profiles: FreelanceProfileResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=freelance.dto.d.ts.map