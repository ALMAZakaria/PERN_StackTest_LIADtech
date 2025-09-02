import { Application } from '@prisma/client';
export interface CreateApplicationData {
    missionId: string;
    freelancerId: string;
    companyId: string;
    proposal: string;
    proposedRate: number;
    estimatedDuration?: number;
}
export interface UpdateApplicationData {
    proposal?: string;
    proposedRate?: number;
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}
export declare class ApplicationRepository {
    create(data: CreateApplicationData): Promise<Application>;
    findById(id: string): Promise<Application | null>;
    findByMissionId(missionId: string): Promise<Application[]>;
    findByFreelancerId(freelancerId: string): Promise<Application[]>;
    findByCompanyId(companyId: string): Promise<Application[]>;
    update(id: string, data: UpdateApplicationData): Promise<Application>;
    delete(id: string): Promise<Application>;
    findMany(filters?: {
        missionId?: string;
        freelancerId?: string;
        companyId?: string;
        status?: string;
    }): Promise<Application[]>;
    checkExistingApplication(missionId: string, freelancerId: string): Promise<Application | null>;
}
//# sourceMappingURL=application.repository.d.ts.map