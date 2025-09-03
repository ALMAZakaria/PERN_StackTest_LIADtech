import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../service/company.service';
import { ResponseUtil } from '../../../utils/response';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class CompanyController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  createProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.companyService.createProfile(userId, req.body);
      ResponseUtil.created(res, profile, 'Company profile created successfully');
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.companyService.getProfile(userId);
      ResponseUtil.success(res, profile, 'Company profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.companyService.updateProfile(userId, req.body);
      ResponseUtil.success(res, profile, 'Company profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.companyService.deleteProfile(userId);
      ResponseUtil.success(res, null, 'Company profile deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  searchCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
      const companies = await this.companyService.searchCompanies({
        industry: filters.industry as string,
        size: filters.size as any,
        location: filters.location as string,
      });
      ResponseUtil.success(res, companies, 'Companies retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getCompanyStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const stats = await this.companyService.getCompanyStats(userId);
      ResponseUtil.success(res, stats, 'Company statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
