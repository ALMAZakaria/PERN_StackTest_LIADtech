import { Request, Response, NextFunction } from 'express';
import { RatingService } from './rating.service';
import { ResponseUtil } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class RatingController {
  private ratingService: RatingService;

  constructor() {
    this.ratingService = new RatingService();
  }

  createRating = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const rating = await this.ratingService.createRating(userId, req.body);
      ResponseUtil.created(res, rating, 'Rating submitted successfully');
    } catch (error) {
      next(error);
    }
  };

  getRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const rating = await this.ratingService.getRating(id);
      ResponseUtil.success(res, rating, 'Rating retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateRating = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const rating = await this.ratingService.updateRating(id, userId, req.body);
      ResponseUtil.success(res, rating, 'Rating updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteRating = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.ratingService.deleteRating(id, userId);
      ResponseUtil.success(res, null, 'Rating deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getUserRatings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const ratings = await this.ratingService.getUserRatings(userId);
      ResponseUtil.success(res, ratings, 'User ratings retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getUserAverageRating = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const averageRating = await this.ratingService.getUserAverageRating(userId);
      ResponseUtil.success(res, averageRating, 'User average rating retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  searchRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query;
      const ratings = await this.ratingService.searchRatings({
        fromUserId: filters.fromUserId as string,
        toUserId: filters.toUserId as string,
        applicationId: filters.applicationId as string,
      });
      ResponseUtil.success(res, ratings, 'Ratings retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
} 
