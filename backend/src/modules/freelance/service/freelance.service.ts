import { FreelanceRepository, CreateFreelanceProfileData, UpdateFreelanceProfileData } from '../repository/freelance.repository';
import { AppError } from '../../../utils/AppError';

export class FreelanceService {
  private freelanceRepository: FreelanceRepository;

  constructor() {
    this.freelanceRepository = new FreelanceRepository();
  }

  async createProfile(userId: string, data: CreateFreelanceProfileData): Promise<any> {
    // Check if profile already exists
    const existingProfile = await this.freelanceRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError('Freelance profile already exists for this user', 400);
    }

    // Validate data
    if (data.dailyRate <= 0) {
      throw new AppError('Daily rate must be greater than 0', 400);
    }

    if (data.availability <= 0 || data.availability > 168) { // Max 168 hours per week
      throw new AppError('Availability must be between 1 and 168 hours per week', 400);
    }

    if (data.experience < 0) {
      throw new AppError('Experience cannot be negative', 400);
    }

    return this.freelanceRepository.create({
      ...data,
      userId,
    });
  }

  async getProfile(userId: string): Promise<any> {
    const profile = await this.freelanceRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Freelance profile not found', 404);
    }

    return profile;
  }

  async updateProfile(userId: string, data: UpdateFreelanceProfileData): Promise<any> {
    const existingProfile = await this.freelanceRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('Freelance profile not found', 404);
    }

    // Validate data if provided
    if (data.dailyRate !== undefined && data.dailyRate <= 0) {
      throw new AppError('Daily rate must be greater than 0', 400);
    }

    if (data.availability !== undefined && (data.availability <= 0 || data.availability > 168)) {
      throw new AppError('Availability must be between 1 and 168 hours per week', 400);
    }

    if (data.experience !== undefined && data.experience < 0) {
      throw new AppError('Experience cannot be negative', 400);
    }

    return this.freelanceRepository.update(userId, data);
  }

  async deleteProfile(userId: string): Promise<void> {
    const existingProfile = await this.freelanceRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('Freelance profile not found', 404);
    }

    await this.freelanceRepository.delete(userId);
  }

  async searchFreelancers(filters?: {
    skills?: string[];
    minRate?: number;
    maxRate?: number;
    location?: string;
    minExperience?: number;
  }): Promise<any[]> {
    return this.freelanceRepository.findMany(filters);
  }

  async getRecommendedMissions(userId: string): Promise<any[]> {
    const profile = await this.freelanceRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Freelance profile not found', 404);
    }

    // Simple matching algorithm based on skills
    // In a real app, this would be more sophisticated
    const { MissionRepository } = await import('../../mission/repository/mission.repository');
    const missionRepository = new MissionRepository();

    return missionRepository.findMany({
      status: 'OPEN',
      skills: profile.skills,
    });
  }
}
