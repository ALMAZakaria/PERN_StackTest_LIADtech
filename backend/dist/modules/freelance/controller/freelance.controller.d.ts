import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
export declare class FreelanceController {
    private freelanceService;
    constructor();
    createProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchFreelancers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRecommendedMissions: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=freelance.controller.d.ts.map