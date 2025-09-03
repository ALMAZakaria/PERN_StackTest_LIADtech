import { Application, Prisma } from '@prisma/client';
export interface ApplicationWithDetails extends Application {
    mission: {
        id: string;
        title: string;
        budget: any;
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
        dailyRate: any;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}
export declare class ApplicationRepository {
    create(data: Prisma.ApplicationCreateInput): Promise<Application>;
    findById(id: string): Promise<ApplicationWithDetails | null>;
    findByMissionId(missionId: string, page?: number, limit?: number): Promise<{
        applications: ({
            freelancer: {
                user: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                skills: string[];
                dailyRate: Prisma.Decimal;
                availability: number;
                bio: string | null;
                location: string | null;
                experience: number;
                isVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            missionId: string;
            freelancerId: string;
            proposal: string;
            proposedRate: Prisma.Decimal;
            estimatedDuration: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByFreelancerId(freelancerId: string, page?: number, limit?: number): Promise<{
        applications: ({
            mission: {
                company: {
                    user: {
                        id: string;
                        email: string;
                        firstName: string;
                        lastName: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    location: string | null;
                    isVerified: boolean;
                    description: string | null;
                    companyName: string;
                    industry: string;
                    size: import(".prisma/client").$Enums.CompanySize;
                    website: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.MissionStatus;
                location: string | null;
                title: string;
                description: string;
                requiredSkills: string[];
                budget: Prisma.Decimal;
                duration: number;
                isRemote: boolean;
                urgency: import(".prisma/client").$Enums.UrgencyLevel;
                companyId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            missionId: string;
            freelancerId: string;
            proposal: string;
            proposedRate: Prisma.Decimal;
            estimatedDuration: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: string, data: Prisma.ApplicationUpdateInput): Promise<Application>;
    updateStatus(id: string, status: string): Promise<Application>;
    delete(id: string): Promise<Application>;
    checkExistingApplication(missionId: string, freelancerId: string): Promise<Application | null>;
    getApplicationStats(freelancerId?: string, companyId?: string): Promise<{
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
    }>;
}
//# sourceMappingURL=application.repository.d.ts.map