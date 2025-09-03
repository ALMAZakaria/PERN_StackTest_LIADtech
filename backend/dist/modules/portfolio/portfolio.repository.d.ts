import { PortfolioProject } from '@prisma/client';
export interface CreatePortfolioProjectData {
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string;
    projectUrl?: string;
    freelancerId: string;
}
export interface UpdatePortfolioProjectData {
    title?: string;
    description?: string;
    technologies?: string[];
    imageUrl?: string;
    projectUrl?: string;
}
export declare class PortfolioRepository {
    create(data: CreatePortfolioProjectData): Promise<PortfolioProject>;
    findById(id: string): Promise<PortfolioProject | null>;
    findByFreelancerId(freelancerId: string): Promise<PortfolioProject[]>;
    update(id: string, data: UpdatePortfolioProjectData): Promise<PortfolioProject>;
    delete(id: string): Promise<PortfolioProject>;
    findMany(filters?: {
        technologies?: string[];
        freelancerId?: string;
    }): Promise<PortfolioProject[]>;
}
//# sourceMappingURL=portfolio.repository.d.ts.map