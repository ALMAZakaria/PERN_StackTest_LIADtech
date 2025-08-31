import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class RatingController {
    private ratingService;
    constructor();
    createRating: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getRating: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRating: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteRating: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getUserRatings: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getUserAverageRating: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    searchRatings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=rating.controller.d.ts.map