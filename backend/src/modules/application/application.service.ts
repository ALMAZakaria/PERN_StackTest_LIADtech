import { ApplicationRepository, CreateApplicationData, UpdateApplicationData, ApplicationFilters, PaginationOptions, PaginatedResult } from './application.repository';
import { AppError } from '../../utils/AppError';

// Interface for creating application from frontend
interface CreateApplicationRequest {
  missionId: string;
  proposal: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export class ApplicationService {
  private applicationRepository: ApplicationRepository;

  constructor() {
    this.applicationRepository = new ApplicationRepository();
  }

  async createApplication(userId: string, data: CreateApplicationRequest): Promise<any> {
    // Validate data
    if (!data.proposal.trim()) {
      throw new AppError('Proposal is required', 400);
    }

    if (data.proposedRate <= 0) {
      throw new AppError('Proposed rate must be positive', 400);
    }

    // Verify the user is a freelancer
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    if (!freelanceProfile) {
      throw new AppError('Freelance profile required to apply to missions', 400);
    }

    // Check if freelancer already applied to this mission
    const existingApplication = await this.applicationRepository.checkExistingApplication(
      data.missionId,
      freelanceProfile.id
    );

    if (existingApplication) {
      throw new AppError('You have already applied to this mission', 400);
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
      freelancerId: freelanceProfile.id,
      companyId: mission.companyId,
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

    // Get user profiles to check permissions
    const { CompanyRepository } = await import('../company/repository/company.repository');
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    
    const companyRepository = new CompanyRepository();
    const freelanceRepository = new FreelanceRepository();
    
    const companyProfile = await companyRepository.findByUserId(userId);
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    const isCompanyOwner = companyProfile && application.companyId === companyProfile.id;
    const isFreelancerOwner = freelanceProfile && application.freelancerId === freelanceProfile.id;

    // Check if user owns this application or is the company
    if (!isFreelancerOwner && !isCompanyOwner) {
      throw new AppError('Not authorized to update this application', 403);
    }

    // Validate data if provided (only for freelancer updates)
    if (isFreelancerOwner) {
      if (data.proposal !== undefined && !data.proposal.trim()) {
        throw new AppError('Proposal cannot be empty', 400);
      }

      if (data.proposedRate !== undefined && data.proposedRate <= 0) {
        throw new AppError('Proposed rate must be positive', 400);
      }
    }

    // Only freelancer can update proposal and rate
    if (!isFreelancerOwner && (data.proposal || data.proposedRate)) {
      throw new AppError('Only freelancer can update proposal and rate', 403);
    }

    // Only company can update status to ACCEPTED/REJECTED, freelancer can withdraw
    if (data.status) {
      if (data.status === 'WITHDRAWN') {
        // Only freelancer can withdraw their own application
        if (!isFreelancerOwner) {
          throw new AppError('Only freelancer can withdraw their own application', 403);
        }
        // Only pending applications can be withdrawn
        if (application.status !== 'PENDING') {
          throw new AppError('Only pending applications can be withdrawn', 400);
        }
      } else if (['ACCEPTED', 'REJECTED'].includes(data.status)) {
        // Only company can accept/reject applications
        if (!isCompanyOwner) {
          throw new AppError('Only company can accept or reject applications', 403);
        }
        // Only pending applications can be accepted/rejected
        if (application.status !== 'PENDING') {
          throw new AppError('Only pending applications can be accepted or rejected', 400);
        }
      }
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
      return this.applicationRepository.findByFreelancerId(freelanceProfile.id);
    } else if (companyProfile) {
      return this.applicationRepository.findByCompanyId(companyProfile.id);
    } else {
      // Return empty array if no profile exists
      return [];
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

  async getUserApplicationsWithPagination(
    userId: string,
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<any>> {
    // Check if user is freelancer or company
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const { CompanyRepository } = await import('../company/repository/company.repository');
    
    const freelanceRepository = new FreelanceRepository();
    const companyRepository = new CompanyRepository();
    
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    const companyProfile = await companyRepository.findByUserId(userId);

    if (freelanceProfile) {
      return this.applicationRepository.findManyWithPagination(
        { ...filters, freelancerId: freelanceProfile.id },
        pagination
      );
    } else if (companyProfile) {
      return this.applicationRepository.findManyWithPagination(
        { ...filters, companyId: companyProfile.id },
        pagination
      );
    } else {
      // Return empty result if no profile exists
      return {
        data: [],
        meta: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  async getMissionApplicationsWithPagination(
    missionId: string,
    userId: string,
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<any>> {
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

    return this.applicationRepository.findManyWithPagination(
      { ...filters, missionId },
      pagination
    );
  }

  async searchApplicationsWithPagination(
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<any>> {
    return this.applicationRepository.findManyWithPagination(filters, pagination);
  }

  async getApplicationStats(userId: string): Promise<any> {
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const { CompanyRepository } = await import('../company/repository/company.repository');
    
    const freelanceRepository = new FreelanceRepository();
    const companyRepository = new CompanyRepository();
    
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    const companyProfile = await companyRepository.findByUserId(userId);

    if (freelanceProfile) {
      // Get stats for freelancer
      const applications = await this.applicationRepository.findByFreelancerId(freelanceProfile.id);
      
      return {
        total: applications.length,
        pending: applications.filter(app => app.status === 'PENDING').length,
        accepted: applications.filter(app => app.status === 'ACCEPTED').length,
        rejected: applications.filter(app => app.status === 'REJECTED').length,
        withdrawn: applications.filter(app => app.status === 'WITHDRAWN').length,
        averageRate: applications.length > 0 
          ? applications.reduce((sum, app) => sum + Number(app.proposedRate), 0) / applications.length 
          : 0,
      };
    } else if (companyProfile) {
      // Get stats for company
      const applications = await this.applicationRepository.findByCompanyId(companyProfile.id);
      
      return {
        total: applications.length,
        pending: applications.filter(app => app.status === 'PENDING').length,
        accepted: applications.filter(app => app.status === 'ACCEPTED').length,
        rejected: applications.filter(app => app.status === 'REJECTED').length,
        withdrawn: applications.filter(app => app.status === 'WITHDRAWN').length,
        averageRate: applications.length > 0 
          ? applications.reduce((sum, app) => sum + Number(app.proposedRate), 0) / applications.length 
          : 0,
      };
    } else {
      return {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0,
        averageRate: 0,
      };
    }
  }
} 
