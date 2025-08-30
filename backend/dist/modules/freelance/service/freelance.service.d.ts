import { CreateFreelanceProfileData, UpdateFreelanceProfileData } from '../repository/freelance.repository';
export declare class FreelanceService {
    private freelanceRepository;
    constructor();
    createProfile(userId: string, data: CreateFreelanceProfileData): Promise<any>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, data: UpdateFreelanceProfileData): Promise<any>;
    deleteProfile(userId: string): Promise<void>;
    searchFreelancers(filters?: {
        skills?: string[];
        minRate?: number;
        maxRate?: number;
        location?: string;
        minExperience?: number;
    }): Promise<any[]>;
    getRecommendedMissions(userId: string): Promise<any[]>;
}
//# sourceMappingURL=freelance.service.d.ts.map