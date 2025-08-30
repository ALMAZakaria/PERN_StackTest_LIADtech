import { Mission } from '@prisma/client';
export interface CreateMissionData {
    title: string;
    description: string;
    requiredSkills: string[];
    budget: number;
    duration: number;
    location?: string;
    isRemote: boolean;
    companyId: string;
}
export interface UpdateMissionData {
    title?: string;
    description?: string;
    requiredSkills?: string[];
    budget?: number;
    duration?: number;
    location?: string;
    isRemote?: boolean;
    status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
export declare class MissionRepository {
    create(data: CreateMissionData): Promise<Mission>;
    findById(id: string): Promise<Mission | null>;
    update(id: string, data: UpdateMissionData): Promise<Mission>;
    delete(id: string): Promise<Mission>;
    findMany(filters?: {
        status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
        skills?: string[];
        minBudget?: number;
        maxBudget?: number;
        location?: string;
        isRemote?: boolean;
        companyId?: string;
    }): Promise<Mission[]>;
    findByCompanyId(companyId: string): Promise<Mission[]>;
}
//# sourceMappingURL=mission.repository.d.ts.map