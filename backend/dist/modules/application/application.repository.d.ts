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
export interface ApplicationFilters {
    missionId?: string;
    freelancerId?: string;
    companyId?: string;
    status?: string;
    minRate?: number;
    maxRate?: number;
    minDuration?: number;
    maxDuration?: number;
    dateFrom?: Date;
    dateTo?: Date;
}
export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
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
    findManyWithPagination(filters?: ApplicationFilters, pagination?: PaginationOptions): Promise<PaginatedResult<Application>>;
    checkExistingApplication(missionId: string, freelancerId: string): Promise<Application | null>;
}
//# sourceMappingURL=application.repository.d.ts.map