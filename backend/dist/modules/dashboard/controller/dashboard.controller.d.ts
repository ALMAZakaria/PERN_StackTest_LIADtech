import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
export declare class DashboardController {
    private dashboardService;
    constructor();
    getStatistics: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getRecentActivity: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map