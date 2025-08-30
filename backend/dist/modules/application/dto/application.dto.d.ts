import { z } from 'zod';
export declare const createApplicationSchema: z.ZodObject<{
    missionId: z.ZodString;
    proposal: z.ZodString;
    proposedRate: z.ZodNumber;
    estimatedDuration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    missionId: string;
    proposal: string;
    proposedRate: number;
    estimatedDuration: number;
}, {
    missionId: string;
    proposal: string;
    proposedRate: number;
    estimatedDuration: number;
}>;
export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;
export declare const updateApplicationSchema: z.ZodObject<{
    proposal: z.ZodOptional<z.ZodString>;
    proposedRate: z.ZodOptional<z.ZodNumber>;
    estimatedDuration: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    proposal?: string | undefined;
    proposedRate?: number | undefined;
    estimatedDuration?: number | undefined;
}, {
    proposal?: string | undefined;
    proposedRate?: number | undefined;
    estimatedDuration?: number | undefined;
}>;
export type UpdateApplicationDto = z.infer<typeof updateApplicationSchema>;
export declare const updateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"]>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
}, {
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
}>;
export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;
export interface ApplicationResponse {
    id: string;
    missionId: string;
    freelancerId: string;
    proposal: string;
    proposedRate: number;
    estimatedDuration: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    mission: {
        id: string;
        title: string;
        budget: number;
        company: {
            id: string;
            companyName: string;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
            };
        };
    };
    freelancer: {
        id: string;
        skills: string[];
        dailyRate: number;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}
export interface ApplicationListResponse {
    applications: ApplicationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ApplicationStatsResponse {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
}
//# sourceMappingURL=application.dto.d.ts.map