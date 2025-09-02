import { Request, Response, NextFunction } from 'express';
import { SkillsService } from './skills.service';
import { ResponseUtil } from '../../utils/response';

export class SkillsController {
  getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = SkillsService.getAllSkills();
      ResponseUtil.success(res, skills, 'Skills retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  searchSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query, limit } = req.query;
      const searchQuery = query as string || '';
      const limitNum = limit ? parseInt(limit as string) : 10;
      
      const skills = SkillsService.searchSkills(searchQuery, limitNum);
      ResponseUtil.success(res, skills, 'Skills search completed successfully');
    } catch (error) {
      next(error);
    }
  };

  validateSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skills } = req.body;
      
      if (!Array.isArray(skills)) {
        ResponseUtil.badRequest(res, 'Skills must be an array');
        return;
      }

      const validation = SkillsService.validateSkills(skills);
      ResponseUtil.success(res, validation, 'Skills validation completed');
    } catch (error) {
      next(error);
    }
  };

  getSkillCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = SkillsService.getSkillCategories();
      ResponseUtil.success(res, categories, 'Skill categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getPopularSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skills = SkillsService.getPopularSkills();
      ResponseUtil.success(res, skills, 'Popular skills retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
