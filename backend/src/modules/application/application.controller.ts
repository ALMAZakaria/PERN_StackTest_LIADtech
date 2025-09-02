import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from './application.service';
import { ResponseUtil } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor() {
    this.applicationService = new ApplicationService();
  }

  createApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const application = await this.applicationService.createApplication(userId, req.body);
      ResponseUtil.created(res, application, 'Application submitted successfully');
    } catch (error) {
      next(error);
    }
  };

  getApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const application = await this.applicationService.getApplication(id);
      ResponseUtil.success(res, application, 'Application retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const application = await this.applicationService.updateApplication(id, userId, req.body);
      ResponseUtil.success(res, application, 'Application updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.applicationService.deleteApplication(id, userId);
      ResponseUtil.success(res, null, 'Application deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getUserApplications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const applications = await this.applicationService.getUserApplications(userId);
      ResponseUtil.success(res, applications, 'User applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getMissionApplications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { missionId } = req.params;
      const userId = req.user!.id;
      const applications = await this.applicationService.getMissionApplications(missionId, userId);
      ResponseUtil.success(res, applications, 'Mission applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  searchApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
      const applications = await this.applicationService.searchApplications({
        missionId: filters.missionId as string,
        freelancerId: filters.freelancerId as string,
        companyId: filters.companyId as string,
        status: filters.status as string,
      });
      ResponseUtil.success(res, applications, 'Applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
} 
