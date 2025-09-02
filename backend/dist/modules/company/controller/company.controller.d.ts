import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
export declare class CompanyController {
    private companyService;
    constructor();
    createProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchCompanies: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCompanyStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=company.controller.d.ts.map