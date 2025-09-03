import { RatingRepository, CreateRatingData, UpdateRatingData } from './rating.repository';
import { AppError } from '../../utils/AppError';

export class RatingService {
  private ratingRepository: RatingRepository;

  constructor() {
    this.ratingRepository = new RatingRepository();
  }

  async createRating(userId: string, data: CreateRatingData): Promise<any> {
    // Validate data
    if (data.rating < 1 || data.rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    if (data.fromUserId !== userId) {
      throw new AppError('You can only create ratings from your own account', 403);
    }

    // Check if rating already exists for this application
    const existingRating = await this.ratingRepository.findByApplicationId(data.applicationId);
    if (existingRating) {
      throw new AppError('Rating already exists for this application', 400);
    }

    // Verify the application exists and is completed
    const { ApplicationRepository } = await import('../application/application.repository');
    const applicationRepository = new ApplicationRepository();
    const application = await applicationRepository.findById(data.applicationId);
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.status !== 'ACCEPTED') {
      throw new AppError('Can only rate completed applications', 400);
    }

    // Verify the user is involved in the application
    if (application.freelancerId !== userId && application.companyId !== userId) {
      throw new AppError('You can only rate applications you are involved in', 403);
    }

    // Verify the target user is the other party in the application
    if (application.freelancerId !== data.toUserId && application.companyId !== data.toUserId) {
      throw new AppError('Invalid target user for rating', 400);
    }

    return this.ratingRepository.create(data);
  }

  async getRating(id: string): Promise<any> {
    const rating = await this.ratingRepository.findById(id);
    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    return rating;
  }

  async updateRating(id: string, userId: string, data: UpdateRatingData): Promise<any> {
    const rating = await this.ratingRepository.findById(id);
    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    // Only the user who created the rating can update it
    if (rating.fromUserId !== userId) {
      throw new AppError('Not authorized to update this rating', 403);
    }

    // Validate data if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    return this.ratingRepository.update(id, data);
  }

  async deleteRating(id: string, userId: string): Promise<void> {
    const rating = await this.ratingRepository.findById(id);
    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    // Only the user who created the rating can delete it
    if (rating.fromUserId !== userId) {
      throw new AppError('Not authorized to delete this rating', 403);
    }

    await this.ratingRepository.delete(id);
  }

  async getUserRatings(userId: string): Promise<any[]> {
    return this.ratingRepository.findByUserId(userId);
  }

  async getUserAverageRating(userId: string): Promise<any> {
    return this.ratingRepository.getUserAverageRating(userId);
  }

  async searchRatings(filters?: {
    fromUserId?: string;
    toUserId?: string;
    applicationId?: string;
  }): Promise<any[]> {
    return this.ratingRepository.findMany(filters);
  }
} 
