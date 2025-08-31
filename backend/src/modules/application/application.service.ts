import { ApplicationRepository, CreateApplicationData, UpdateApplicationData } from './application.repository';
import { AppError } from '../../utils/AppError';

export class ApplicationService {
  private applicationRepository: ApplicationRepository;

  constructor() {
    this.applicationRepository = new ApplicationRepository();
  }

  async createApplication(userId: string, data: CreateApplicationData): Promise<any> {
    // Validate data
    if (!data.proposal.trim()) {
      throw new AppError('Proposal is required', 400);
    }

    if (data.proposedRate <= 0) {
      throw new AppError('Proposed rate must be positive', 400);
    }

    // Check if freelancer already applied to this mission
    const existingApplication = await this.applicationRepository.checkExistingApplication(
      data.missionId,
      data.freelancerId
    );

    if (existingApplication) {
      throw new AppError('You have already applied to this mission', 400);
    }

    // Verify the user is a freelancer
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    if (!freelanceProfile) {
      throw new AppError('Freelance profile required to apply to missions', 400);
    }

    // Verify the mission exists and is open
    const { MissionRepository } = await import('../mission/repository/mission.repository');
    const missionRepository = new MissionRepository();
    const mission = await missionRepository.findById(data.missionId);
    
    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    if (mission.status !== 'OPEN') {
      throw new AppError('Mission is not open for applications', 400);
    }

    return this.applicationRepository.create({
      ...data,
      freelancerId: userId,
    });
  }

  async getApplication(id: string): Promise<any> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    return application;
  }

  async updateApplication(id: string, userId: string, data: UpdateApplicationData): Promise<any> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    // Check if user owns this application or is the company
    if (application.freelancerId !== userId && application.companyId !== userId) {
      throw new AppError('Not authorized to update this application', 403);
    }

    // Only freelancer can update proposal and rate
    if (application.freelancerId !== userId && (data.proposal || data.proposedRate)) {
      throw new AppError('Only freelancer can update proposal and rate', 403);
    }

    // Only company can update status
    if (application.companyId !== userId && data.status) {
      throw new AppError('Only company can update application status', 403);
    }

    // Validate data if provided
    if (data.proposal !== undefined && !data.proposal.trim()) {
      throw new AppError('Proposal cannot be empty', 400);
    }

    if (data.proposedRate !== undefined && data.proposedRate <= 0) {
      throw new AppError('Proposed rate must be positive', 400);
    }

    return this.applicationRepository.update(id, data);
  }

  async deleteApplication(id: string, userId: string): Promise<void> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    // Only freelancer can delete their own application
    if (application.freelancerId !== userId) {
      throw new AppError('Not authorized to delete this application', 403);
    }

    await this.applicationRepository.delete(id);
  }

  async getUserApplications(userId: string): Promise<any[]> {
    // Check if user is freelancer or company
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const { CompanyRepository } = await import('../company/repository/company.repository');
    
    const freelanceRepository = new FreelanceRepository();
    const companyRepository = new CompanyRepository();
    
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    const companyProfile = await companyRepository.findByUserId(userId);

    if (freelanceProfile) {
      return this.applicationRepository.findByFreelancerId(userId);
    } else if (companyProfile) {
      return this.applicationRepository.findByCompanyId(userId);
    } else {
      throw new AppError('User profile not found', 404);
    }
  }

  async getMissionApplications(missionId: string, userId: string): Promise<any[]> {
    // Verify the user owns the mission
    const { MissionRepository } = await import('../mission/repository/mission.repository');
    const missionRepository = new MissionRepository();
    const mission = await missionRepository.findById(missionId);
    
    if (!mission) {
      throw new AppError('Mission not found', 404);
    }

    // Get company profile to verify ownership
    const { CompanyRepository } = await import('../company/repository/company.repository');
    const companyRepository = new CompanyRepository();
    const companyProfile = await companyRepository.findByUserId(userId);
    
    if (!companyProfile || mission.companyId !== companyProfile.id) {
      throw new AppError('Not authorized to view applications for this mission', 403);
    }

    return this.applicationRepository.findByMissionId(missionId);
  }

  async searchApplications(filters?: {
    missionId?: string;
    freelancerId?: string;
    companyId?: string;
    status?: string;
  }): Promise<any[]> {
    return this.applicationRepository.findMany(filters);
  }
} 
