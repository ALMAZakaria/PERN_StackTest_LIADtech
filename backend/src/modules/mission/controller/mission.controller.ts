import { Request, Response, NextFunction } from 'express';
import { MissionService } from '../service/mission.service';
import { ResponseUtil } from '../../../utils/response';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class MissionController {
  private missionService: MissionService;

  constructor() {
    this.missionService = new MissionService();
  }

  createMission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const mission = await this.missionService.createMission(userId, req.body);
      ResponseUtil.created(res, mission, 'Mission created successfully');
    } catch (error) {
      next(error);
    }
  };

  getMission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const mission = await this.missionService.getMission(id);
      ResponseUtil.success(res, mission, 'Mission retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateMission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const mission = await this.missionService.updateMission(id, userId, req.body);
      ResponseUtil.success(res, mission, 'Mission updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteMission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.missionService.deleteMission(id, userId);
      ResponseUtil.success(res, null, 'Mission deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  searchMissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
      const missions = await this.missionService.searchMissions({
        status: filters.status as any,
        skills: filters.skills ? (filters.skills as string).split(',') : undefined,
        minBudget: filters.minBudget ? Number(filters.minBudget) : undefined,
        maxBudget: filters.maxBudget ? Number(filters.maxBudget) : undefined,
        location: filters.location as string,
        isRemote: filters.isRemote ? filters.isRemote === 'true' : undefined,
      });
      ResponseUtil.success(res, missions, 'Missions retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getCompanyMissions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const missions = await this.missionService.getCompanyMissions(userId);
      ResponseUtil.success(res, missions, 'Company missions retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getRecommendedFreelancers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { missionId } = req.params;
      const freelancers = await this.missionService.getRecommendedFreelancers(missionId);
      ResponseUtil.success(res, freelancers, 'Recommended freelancers retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
