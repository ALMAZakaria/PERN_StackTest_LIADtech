import { CreatePortfolioProjectData, UpdatePortfolioProjectData } from './portfolio.repository';
export declare class PortfolioService {
    private portfolioRepository;
    constructor();
    createProject(userId: string, data: CreatePortfolioProjectData): Promise<any>;
    getProject(id: string): Promise<any>;
    updateProject(id: string, userId: string, data: UpdatePortfolioProjectData): Promise<any>;
    deleteProject(id: string, userId: string): Promise<void>;
    getUserPortfolio(userId: string): Promise<any[]>;
    searchPortfolios(filters?: {
        technologies?: string[];
        freelancerId?: string;
    }): Promise<any[]>;
}
//# sourceMappingURL=portfolio.service.d.ts.map