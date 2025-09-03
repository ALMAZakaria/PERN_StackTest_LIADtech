import { CreateMissionData, UpdateMissionData } from '../repository/mission.repository';
export declare class MissionService {
    private missionRepository;
    constructor();
    createMission(userId: string, data: CreateMissionData): Promise<any>;
    getMission(id: string): Promise<any>;
    updateMission(id: string, userId: string, data: UpdateMissionData): Promise<any>;
    deleteMission(id: string, userId: string): Promise<void>;
    searchMissions(filters?: {
        status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
        skills?: string[];
        minBudget?: number;
        maxBudget?: number;
        location?: string;
        isRemote?: boolean;
    }): Promise<any[]>;
    getCompanyMissions(userId: string): Promise<any[]>;
    getRecommendedFreelancers(missionId: string): Promise<any[]>;
}
//# sourceMappingURL=mission.service.d.ts.map