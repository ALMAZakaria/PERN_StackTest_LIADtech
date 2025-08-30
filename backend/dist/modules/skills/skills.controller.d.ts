import { Request, Response, NextFunction } from 'express';
export declare class SkillsController {
    getAllSkills: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    searchSkills: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateSkills: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSkillCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPopularSkills: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=skills.controller.d.ts.map