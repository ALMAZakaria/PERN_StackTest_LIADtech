import { Request, Response, NextFunction } from 'express';
import { FreelanceService } from '../service/freelance.service';
import { ResponseUtil } from '../../../utils/response';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class FreelanceController {
  private freelanceService: FreelanceService;

  constructor() {
    this.freelanceService = new FreelanceService();
  }

  createProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.freelanceService.createProfile(userId, req.body);
      ResponseUtil.created(res, profile, 'Freelance profile created successfully');
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.freelanceService.getProfile(userId);
      ResponseUtil.success(res, profile, 'Freelance profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.freelanceService.updateProfile(userId, req.body);
      ResponseUtil.success(res, profile, 'Freelance profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.freelanceService.deleteProfile(userId);
      ResponseUtil.success(res, null, 'Freelance profile deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  searchFreelancers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
      const freelancers = await this.freelanceService.searchFreelancers({
        skills: filters.skills ? (filters.skills as string).split(',') : undefined,
        minRate: filters.minRate ? Number(filters.minRate) : undefined,
        maxRate: filters.maxRate ? Number(filters.maxRate) : undefined,
        location: filters.location as string,
        minExperience: filters.minExperience ? Number(filters.minExperience) : undefined,
      });
      ResponseUtil.success(res, freelancers, 'Freelancers retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getRecommendedMissions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const missions = await this.freelanceService.getRecommendedMissions(userId);
      ResponseUtil.success(res, missions, 'Recommended missions retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
