export interface DashboardStatistics {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    systemStatus: string;
    totalFreelancers?: number;
    totalCompanies?: number;
    totalMissions?: number;
}
export interface RecentActivity {
    id: string;
    type: 'user_registered' | 'user_login' | 'user_updated' | 'system_update';
    title: string;
    description: string;
    time: Date;
    userId?: string;
    userName?: string;
}
export declare class DashboardService {
    getStatistics(): Promise<DashboardStatistics>;
    getRecentActivity(limit?: number): Promise<RecentActivity[]>;
}
//# sourceMappingURL=dashboard.service.d.ts.map