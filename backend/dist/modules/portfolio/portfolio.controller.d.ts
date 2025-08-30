import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class PortfolioController {
    private portfolioService;
    constructor();
    createProject: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProject: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteProject: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getUserPortfolio: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchPortfolios: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=portfolio.controller.d.ts.map