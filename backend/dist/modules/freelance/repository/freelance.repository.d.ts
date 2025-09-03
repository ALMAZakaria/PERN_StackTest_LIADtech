import { FreelanceProfile } from '@prisma/client';
export interface CreateFreelanceProfileData {
    userId: string;
    bio?: string;
    skills: string[];
    dailyRate: number;
    availability: number;
    location?: string;
    experience: number;
}
export interface UpdateFreelanceProfileData {
    bio?: string;
    skills?: string[];
    dailyRate?: number;
    availability?: number;
    location?: string;
    experience?: number;
}
export declare class FreelanceRepository {
    create(data: CreateFreelanceProfileData): Promise<FreelanceProfile>;
    findByUserId(userId: string): Promise<FreelanceProfile | null>;
    update(userId: string, data: UpdateFreelanceProfileData): Promise<FreelanceProfile>;
    delete(userId: string): Promise<FreelanceProfile>;
    findMany(filters?: {
        skills?: string[];
        minRate?: number;
        maxRate?: number;
        location?: string;
        minExperience?: number;
    }): Promise<FreelanceProfile[]>;
}
//# sourceMappingURL=freelance.repository.d.ts.map