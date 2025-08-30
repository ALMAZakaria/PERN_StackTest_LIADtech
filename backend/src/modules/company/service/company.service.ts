import { CompanyRepository, CreateCompanyProfileData, UpdateCompanyProfileData } from '../repository/company.repository';
import { AppError } from '../../../utils/AppError';

export class CompanyService {
  private companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  async createProfile(userId: string, data: CreateCompanyProfileData): Promise<any> {
    // Check if profile already exists
    const existingProfile = await this.companyRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError('Company profile already exists for this user', 400);
    }

    // Validate data
    if (!data.companyName.trim()) {
      throw new AppError('Company name is required', 400);
    }

    if (!data.industry.trim()) {
      throw new AppError('Industry is required', 400);
    }

    return this.companyRepository.create({
      ...data,
      userId,
    });
  }

  async getProfile(userId: string): Promise<any> {
    const profile = await this.companyRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Company profile not found', 404);
    }

    return profile;
  }

  async updateProfile(userId: string, data: UpdateCompanyProfileData): Promise<any> {
    const existingProfile = await this.companyRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('Company profile not found', 404);
    }

    // Validate data if provided
    if (data.companyName !== undefined && !data.companyName.trim()) {
      throw new AppError('Company name cannot be empty', 400);
    }

    if (data.industry !== undefined && !data.industry.trim()) {
      throw new AppError('Industry cannot be empty', 400);
    }

    return this.companyRepository.update(userId, data);
  }

  async deleteProfile(userId: string): Promise<void> {
    const existingProfile = await this.companyRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('Company profile not found', 404);
    }

    await this.companyRepository.delete(userId);
  }

  async searchCompanies(filters?: {
    industry?: string;
    size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    location?: string;
  }): Promise<any[]> {
    return this.companyRepository.findMany(filters);
  }

  async getCompanyStats(userId: string): Promise<any> {
    const profile = await this.companyRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Company profile not found', 404);
    }

    // For now, return basic stats without missions (will be implemented later)
    return {
      totalMissions: 0,
      openMissions: 0,
      totalApplications: 0,
      averageApplicationsPerMission: 0,
    };
  }
}
