import { Request, Response, NextFunction } from 'express';
import { PortfolioService } from './portfolio.service';
import { ResponseUtil } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class PortfolioController {
  private portfolioService: PortfolioService;

  constructor() {
    this.portfolioService = new PortfolioService();
  }

  createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const project = await this.portfolioService.createProject(userId, req.body);
      ResponseUtil.created(res, project, 'Portfolio project created successfully');
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const project = await this.portfolioService.getProject(id);
      ResponseUtil.success(res, project, 'Portfolio project retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const project = await this.portfolioService.updateProject(id, userId, req.body);
      ResponseUtil.success(res, project, 'Portfolio project updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.portfolioService.deleteProject(id, userId);
      ResponseUtil.success(res, null, 'Portfolio project deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getUserPortfolio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const portfolio = await this.portfolioService.getUserPortfolio(userId);
      ResponseUtil.success(res, portfolio, 'User portfolio retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  searchPortfolios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
      const portfolios = await this.portfolioService.searchPortfolios({
        technologies: filters.technologies ? (filters.technologies as string).split(',') : undefined,
        freelancerId: filters.freelancerId as string,
      });
      ResponseUtil.success(res, portfolios, 'Portfolios retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
