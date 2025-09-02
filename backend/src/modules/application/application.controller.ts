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

  getUserApplicationsWithPagination = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';
      const status = req.query.status as string;
      const minRate = req.query.minRate ? parseFloat(req.query.minRate as string) : undefined;
      const maxRate = req.query.maxRate ? parseFloat(req.query.maxRate as string) : undefined;
      const minDuration = req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined;
      const maxDuration = req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined;
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

      const filters = {
        status,
        minRate,
        maxRate,
        minDuration,
        maxDuration,
        dateFrom,
        dateTo,
      };

      const pagination = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      const result = await this.applicationService.getUserApplicationsWithPagination(userId, filters, pagination);
      ResponseUtil.success(res, result, 'User applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getMissionApplicationsWithPagination = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { missionId } = req.params;
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';
      const status = req.query.status as string;
      const minRate = req.query.minRate ? parseFloat(req.query.minRate as string) : undefined;
      const maxRate = req.query.maxRate ? parseFloat(req.query.maxRate as string) : undefined;
      const minDuration = req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined;
      const maxDuration = req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined;
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

      const filters = {
        status,
        minRate,
        maxRate,
        minDuration,
        maxDuration,
        dateFrom,
        dateTo,
      };

      const pagination = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      const result = await this.applicationService.getMissionApplicationsWithPagination(missionId, userId, filters, pagination);
      ResponseUtil.success(res, result, 'Mission applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  searchApplicationsWithPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';
      const missionId = req.query.missionId as string;
      const freelancerId = req.query.freelancerId as string;
      const companyId = req.query.companyId as string;
      const status = req.query.status as string;
      const minRate = req.query.minRate ? parseFloat(req.query.minRate as string) : undefined;
      const maxRate = req.query.maxRate ? parseFloat(req.query.maxRate as string) : undefined;
      const minDuration = req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined;
      const maxDuration = req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined;
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

      const filters = {
        missionId,
        freelancerId,
        companyId,
        status,
        minRate,
        maxRate,
        minDuration,
        maxDuration,
        dateFrom,
        dateTo,
      };

      const pagination = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      const result = await this.applicationService.searchApplicationsWithPagination(filters, pagination);
      ResponseUtil.success(res, result, 'Applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getApplicationStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const stats = await this.applicationService.getApplicationStats(userId);
      ResponseUtil.success(res, stats, 'Application statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
} 
