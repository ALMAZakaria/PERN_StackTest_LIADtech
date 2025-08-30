import { MissionRepository, CreateMissionData, UpdateMissionData } from '../repository/mission.repository';
import { AppError } from '../../../utils/AppError';

export class MissionService {
  private missionRepository: MissionRepository;

  constructor() {
    this.missionRepository = new MissionRepository();
  }

  async createMission(userId: string, data: CreateMissionData): Promise<any> {
    // Validate data
    if (!data.title.trim()) {
      throw new AppError('Mission title is required', 400);
    }

    if (!data.description.trim()) {
      throw new AppError('Mission description is required', 400);
    }

    if (data.requiredSkills.length === 0) {
      throw new AppError('At least one required skill is needed', 400);
    }

    if (data.budget <= 0) {
      throw new AppError('Budget must be greater than 0', 400);
    }

    if (data.duration <= 0) {
      throw new AppError('Duration must be greater than 0', 400);
    }

    // Verify the user has a company profile
    const { CompanyRepository } = await import('../../company/repository/company.repository');
    const companyRepository = new CompanyRepository();
    const companyProfile = await companyRepository.findByUserId(userId);
    
    if (!companyProfile) {
      throw new AppError('Company profile required to create missions', 400);
    }

    return this.missionRepository.create({
      ...data,
      companyId: companyProfile.id,
    });
  }

  async getMission(id: string): Promise<any> {
    const mission = await this.missionRepository.findById(id);
    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    return mission;
  }

  async updateMission(id: string, userId: string, data: UpdateMissionData): Promise<any> {
    const mission = await this.missionRepository.findById(id);
    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    // Check if user owns this mission
    const { CompanyRepository } = await import('../../company/repository/company.repository');
    const companyRepository = new CompanyRepository();
    const companyProfile = await companyRepository.findByUserId(userId);
    
    if (!companyProfile || mission.companyId !== companyProfile.id) {
      throw new AppError('Not authorized to update this mission', 403);
    }

    // Validate data if provided
    if (data.title !== undefined && !data.title.trim()) {
      throw new AppError('Mission title cannot be empty', 400);
    }

    if (data.description !== undefined && !data.description.trim()) {
      throw new AppError('Mission description cannot be empty', 400);
    }

    if (data.requiredSkills !== undefined && data.requiredSkills.length === 0) {
      throw new AppError('At least one required skill is needed', 400);
    }

    if (data.budget !== undefined && data.budget <= 0) {
      throw new AppError('Budget must be greater than 0', 400);
    }

    if (data.duration !== undefined && data.duration <= 0) {
      throw new AppError('Duration must be greater than 0', 400);
    }

    return this.missionRepository.update(id, data);
  }

  async deleteMission(id: string, userId: string): Promise<void> {
    const mission = await this.missionRepository.findById(id);
    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    // Check if user owns this mission
    const { CompanyRepository } = await import('../../company/repository/company.repository');
    const companyRepository = new CompanyRepository();
    const companyProfile = await companyRepository.findByUserId(userId);
    
    if (!companyProfile || mission.companyId !== companyProfile.id) {
      throw new AppError('Not authorized to delete this mission', 403);
    }

    await this.missionRepository.delete(id);
  }

  async searchMissions(filters?: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    skills?: string[];
    minBudget?: number;
    maxBudget?: number;
    location?: string;
    isRemote?: boolean;
  }): Promise<any[]> {
    return this.missionRepository.findMany(filters);
  }

  async getCompanyMissions(userId: string): Promise<any[]> {
    const { CompanyRepository } = await import('../../company/repository/company.repository');
    const companyRepository = new CompanyRepository();
    const companyProfile = await companyRepository.findByUserId(userId);
    
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    return this.missionRepository.findByCompanyId(companyProfile.id);
  }

  async getRecommendedFreelancers(missionId: string): Promise<any[]> {
    const mission = await this.missionRepository.findById(missionId);
    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    // Simple matching algorithm based on skills
    const { FreelanceRepository } = await import('../../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();

    return freelanceRepository.findMany({
      skills: mission.requiredSkills,
    });
  }
}
