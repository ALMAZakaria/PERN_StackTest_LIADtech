import { UpdateApplicationData, ApplicationFilters, PaginationOptions, PaginatedResult } from './application.repository';
interface CreateApplicationRequest {
    missionId: string;
    proposal: string;
    proposedRate: number;
    estimatedDuration?: number;
}
export declare class ApplicationService {
    private applicationRepository;
    constructor();
    createApplication(userId: string, data: CreateApplicationRequest): Promise<any>;
    getApplication(id: string): Promise<any>;
    updateApplication(id: string, userId: string, data: UpdateApplicationData): Promise<any>;
    deleteApplication(id: string, userId: string): Promise<void>;
    getUserApplications(userId: string): Promise<any[]>;
    getMissionApplications(missionId: string, userId: string): Promise<any[]>;
    searchApplications(filters?: {
        missionId?: string;
        freelancerId?: string;
        companyId?: string;
        status?: string;
    }): Promise<any[]>;
    getUserApplicationsWithPagination(userId: string, filters?: ApplicationFilters, pagination?: PaginationOptions): Promise<PaginatedResult<any>>;
    getMissionApplicationsWithPagination(missionId: string, userId: string, filters?: ApplicationFilters, pagination?: PaginationOptions): Promise<PaginatedResult<any>>;
    searchApplicationsWithPagination(filters?: ApplicationFilters, pagination?: PaginationOptions): Promise<PaginatedResult<any>>;
    getApplicationStats(userId: string): Promise<any>;
}
export {};
//# sourceMappingURL=application.service.d.ts.map