import { CreateApplicationData, UpdateApplicationData } from './application.repository';
export declare class ApplicationService {
    private applicationRepository;
    constructor();
    createApplication(userId: string, data: CreateApplicationData): Promise<any>;
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
}
//# sourceMappingURL=application.service.d.ts.map