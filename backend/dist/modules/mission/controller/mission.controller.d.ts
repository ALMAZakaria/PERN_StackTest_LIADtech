import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
export declare class MissionController {
    private missionService;
    constructor();
    createMission: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getMission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMission: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteMission: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchMissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCompanyMissions: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getRecommendedFreelancers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=mission.controller.d.ts.map