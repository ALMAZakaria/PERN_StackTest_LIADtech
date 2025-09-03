import { PortfolioRepository, CreatePortfolioProjectData, UpdatePortfolioProjectData } from './portfolio.repository';
import { AppError } from '../../utils/AppError';

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;

  constructor() {
    this.portfolioRepository = new PortfolioRepository();
  }

  async createProject(userId: string, data: CreatePortfolioProjectData): Promise<any> {
    // Validate data
    if (!data.title.trim()) {
      throw new AppError('Project title is required', 400);
    }

    if (!data.description.trim()) {
      throw new AppError('Project description is required', 400);
    }

    if (data.technologies.length === 0) {
      throw new AppError('At least one technology is required', 400);
    }

    // Verify the user has a freelance profile
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    if (!freelanceProfile) {
      throw new AppError('Freelance profile required to create portfolio projects', 400);
    }

    return this.portfolioRepository.create({
      ...data,
      freelancerId: freelanceProfile.id,
    });
  }

  async getProject(id: string): Promise<any> {
    const project = await this.portfolioRepository.findById(id);
    if (!project) {
      throw new AppError('Portfolio project not found', 404);
    }

    return project;
  }

  async updateProject(id: string, userId: string, data: UpdatePortfolioProjectData): Promise<any> {
    const project = await this.portfolioRepository.findById(id);
    if (!project) {
      throw new AppError('Portfolio project not found', 404);
    }

    // Check if user owns this project
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    if (!freelanceProfile || project.freelancerId !== freelanceProfile.id) {
      throw new AppError('Not authorized to update this project', 403);
    }

    // Validate data if provided
    if (data.title !== undefined && !data.title.trim()) {
      throw new AppError('Project title cannot be empty', 400);
    }

    if (data.description !== undefined && !data.description.trim()) {
      throw new AppError('Project description cannot be empty', 400);
    }

    if (data.technologies !== undefined && data.technologies.length === 0) {
      throw new AppError('At least one technology is required', 400);
    }

    return this.portfolioRepository.update(id, data);
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const project = await this.portfolioRepository.findById(id);
    if (!project) {
      throw new AppError('Portfolio project not found', 404);
    }

    // Check if user owns this project
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    if (!freelanceProfile || project.freelancerId !== freelanceProfile.id) {
      throw new AppError('Not authorized to delete this project', 403);
    }

    await this.portfolioRepository.delete(id);
  }

  async getUserPortfolio(userId: string): Promise<any[]> {
    const { FreelanceRepository } = await import('../freelance/repository/freelance.repository');
    const freelanceRepository = new FreelanceRepository();
    const freelanceProfile = await freelanceRepository.findByUserId(userId);
    
    if (!freelanceProfile) {
      throw new AppError('Freelance profile not found', 404);
    }

    return this.portfolioRepository.findByFreelancerId(freelanceProfile.id);
  }

  async searchPortfolios(filters?: {
    technologies?: string[];
    freelancerId?: string;
  }): Promise<any[]> {
    return this.portfolioRepository.findMany(filters);
  }
}
