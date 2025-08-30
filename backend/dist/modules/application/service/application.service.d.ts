import { CreateApplicationDto, UpdateApplicationDto, UpdateApplicationStatusDto, ApplicationResponse, ApplicationListResponse, ApplicationStatsResponse } from '../dto/application.dto';
export declare class ApplicationService {
    private applicationRepository;
    constructor();
    createApplication(freelancerId: string, data: CreateApplicationDto): Promise<ApplicationResponse>;
    getApplicationById(id: string): Promise<ApplicationResponse>;
    getApplicationsByMission(missionId: string, page?: number, limit?: number): Promise<ApplicationListResponse>;
    getApplicationsByFreelancer(freelancerId: string, page?: number, limit?: number): Promise<ApplicationListResponse>;
    updateApplication(id: string, data: UpdateApplicationDto): Promise<ApplicationResponse>;
    updateApplicationStatus(id: string, data: UpdateApplicationStatusDto): Promise<ApplicationResponse>;
    deleteApplication(id: string): Promise<void>;
    getApplicationStats(freelancerId?: string, companyId?: string): Promise<ApplicationStatsResponse>;
    private mapToResponse;
}
//# sourceMappingURL=application.service.d.ts.map