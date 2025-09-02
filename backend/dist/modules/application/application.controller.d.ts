import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class ApplicationController {
    private applicationService;
    constructor();
    createApplication: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getApplication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateApplication: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteApplication: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getUserApplications: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getMissionApplications: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchApplications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserApplicationsWithPagination: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getMissionApplicationsWithPagination: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchApplicationsWithPagination: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getApplicationStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=application.controller.d.ts.map