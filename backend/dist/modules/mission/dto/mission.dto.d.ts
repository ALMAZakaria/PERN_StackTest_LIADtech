import { z } from 'zod';
export declare const createMissionSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    requiredSkills: z.ZodArray<z.ZodString, "many">;
    budget: z.ZodNumber;
    duration: z.ZodNumber;
    location: z.ZodOptional<z.ZodString>;
    isRemote: z.ZodDefault<z.ZodBoolean>;
    urgency: z.ZodDefault<z.ZodEnum<["LOW", "NORMAL", "HIGH", "URGENT"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    requiredSkills: string[];
    budget: number;
    duration: number;
    isRemote: boolean;
    urgency: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    location?: string | undefined;
}, {
    title: string;
    description: string;
    requiredSkills: string[];
    budget: number;
    duration: number;
    location?: string | undefined;
    isRemote?: boolean | undefined;
    urgency?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
}>;
export type CreateMissionDto = z.infer<typeof createMissionSchema>;
export declare const updateMissionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    budget: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isRemote: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    urgency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["LOW", "NORMAL", "HIGH", "URGENT"]>>>;
}, "strip", z.ZodTypeAny, {
    location?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    requiredSkills?: string[] | undefined;
    budget?: number | undefined;
    duration?: number | undefined;
    isRemote?: boolean | undefined;
    urgency?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
}, {
    location?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    requiredSkills?: string[] | undefined;
    budget?: number | undefined;
    duration?: number | undefined;
    isRemote?: boolean | undefined;
    urgency?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
}>;
export type UpdateMissionDto = z.infer<typeof updateMissionSchema>;
export declare const searchMissionsSchema: z.ZodObject<{
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    minBudget: z.ZodOptional<z.ZodNumber>;
    maxBudget: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    isRemote: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "EXPIRED"]>>;
    urgency: z.ZodOptional<z.ZodEnum<["LOW", "NORMAL", "HIGH", "URGENT"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "CANCELLED" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED" | undefined;
    skills?: string[] | undefined;
    location?: string | undefined;
    isRemote?: boolean | undefined;
    urgency?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
    minBudget?: number | undefined;
    maxBudget?: number | undefined;
}, {
    status?: "CANCELLED" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED" | undefined;
    skills?: string[] | undefined;
    location?: string | undefined;
    isRemote?: boolean | undefined;
    urgency?: "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    minBudget?: number | undefined;
    maxBudget?: number | undefined;
}>;
export type SearchMissionsDto = z.infer<typeof searchMissionsSchema>;
export interface MissionResponse {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    budget: number;
    duration: number;
    location?: string;
    isRemote: boolean;
    status: string;
    urgency: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    company: {
        id: string;
        companyName: string;
        industry: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
    applications: {
        id: string;
        status: string;
        createdAt: Date;
    }[];
}
export interface MissionSearchResponse {
    missions: MissionResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface MissionStatsResponse {
    total: number;
    open: number;
    inProgress: number;
    completed: number;
}
//# sourceMappingURL=mission.dto.d.ts.map