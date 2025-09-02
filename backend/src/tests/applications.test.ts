import { ApplicationService } from '../modules/application/application.service';

// Mock the repositories
const mockApplicationRepository = {
  checkExistingApplication: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn()
};

const mockFreelanceRepository = {
  findByUserId: jest.fn()
};

const mockMissionRepository = {
  findById: jest.fn()
};

jest.mock('../modules/application/application.repository', () => ({
  ApplicationRepository: jest.fn().mockImplementation(() => mockApplicationRepository)
}));

jest.mock('../modules/freelance/repository/freelance.repository', () => ({
  FreelanceRepository: jest.fn().mockImplementation(() => mockFreelanceRepository)
}));

jest.mock('../modules/mission/repository/mission.repository', () => ({
  MissionRepository: jest.fn().mockImplementation(() => mockMissionRepository)
}));

describe('ApplicationService', () => {
  let applicationService: ApplicationService;

  beforeEach(() => {
    applicationService = new ApplicationService();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockApplicationRepository.checkExistingApplication.mockResolvedValue(null);
    mockApplicationRepository.create.mockResolvedValue({
      id: 'test-application-id',
      missionId: 'test-mission-id',
      freelancerId: 'test-freelancer-id',
      companyId: 'test-company-id',
      proposal: 'Test proposal',
      proposedRate: 500,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    mockApplicationRepository.findById.mockResolvedValue({
      id: 'test-application-id',
      missionId: 'test-mission-id',
      freelancerId: 'test-freelancer-id',
      companyId: 'test-company-id',
      proposal: 'Test proposal',
      proposedRate: 500,
      status: 'PENDING'
    });
    mockApplicationRepository.update.mockResolvedValue({
      id: 'test-application-id',
      missionId: 'test-mission-id',
      freelancerId: 'test-freelancer-id',
      proposal: 'Test proposal',
      proposedRate: 500,
      status: 'ACCEPTED',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    mockFreelanceRepository.findByUserId.mockResolvedValue({
      id: 'test-freelance-id',
      userId: 'test-freelancer-id',
      skills: ['JavaScript', 'React'],
      dailyRate: 100,
      availability: 40,
      experience: 3
    });
    
    mockMissionRepository.findById.mockResolvedValue({
      id: 'test-mission-id',
      title: 'Test Mission',
      description: 'Test mission description',
      status: 'OPEN',
      companyId: 'test-company-id'
    });
  });

  describe('createApplication', () => {
    it('should create application successfully', async () => {
      const applicationData = {
        missionId: 'test-mission-id',
        freelancerId: 'test-freelancer-id',
        companyId: 'test-company-id',
        proposal: 'I am excited to work on this project.',
        proposedRate: 500
      };

      // Mock the create method to return the actual data passed
      mockApplicationRepository.create.mockResolvedValue({
        ...applicationData,
        id: 'test-application-id',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await applicationService.createApplication('test-freelancer-id', applicationData);

      expect(result).toBeDefined();
      expect(result.missionId).toBe(applicationData.missionId);
      expect(result.proposal).toBe(applicationData.proposal);
      expect(result.proposedRate).toBe(applicationData.proposedRate);
    });

    it('should validate required fields', async () => {
      // Mock mission not found
      mockMissionRepository.findById.mockResolvedValue(null);

      const invalidData = {
        missionId: 'non-existent-mission',
        freelancerId: 'test-freelancer-id',
        companyId: 'test-company-id',
        proposal: 'Test proposal',
        proposedRate: 500
      };

      await expect(
        applicationService.createApplication('test-user-id', invalidData as any)
      ).rejects.toThrow('Mission not found');
    });

    it('should reject empty proposal', async () => {
      const invalidData = {
        missionId: 'test-mission-id',
        freelancerId: 'test-freelancer-id',
        companyId: 'test-company-id',
        proposal: '',
        proposedRate: 500
      };

      await expect(
        applicationService.createApplication('test-user-id', invalidData as any)
      ).rejects.toThrow('Proposal is required');
    });

    it('should reject negative proposed rate', async () => {
      const invalidData = {
        missionId: 'test-mission-id',
        freelancerId: 'test-freelancer-id',
        companyId: 'test-company-id',
        proposal: 'Test proposal',
        proposedRate: -100
      };

      await expect(
        applicationService.createApplication('test-user-id', invalidData as any)
      ).rejects.toThrow('Proposed rate must be positive');
    });
  });

  describe('getApplication', () => {
    it('should return application by id', async () => {
      const result = await applicationService.getApplication('test-application-id');

      expect(result).toBeDefined();
      expect(result.id).toBe('test-application-id');
    });

    it('should throw error for non-existent application', async () => {
      mockApplicationRepository.findById.mockResolvedValue(null);

      await expect(
        applicationService.getApplication('non-existent-id')
      ).rejects.toThrow('Application not found');
    });
  });

  describe('updateApplication', () => {
    it('should update application successfully', async () => {
      const updateData = {
        status: 'ACCEPTED' as const
      };

      const result = await applicationService.updateApplication('test-application-id', 'test-company-id', updateData);

      expect(result).toBeDefined();
      expect(result.status).toBe('ACCEPTED');
    });

    it('should reject empty proposal update', async () => {
      const updateData = {
        proposal: ''
      };

      await expect(
        applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData)
      ).rejects.toThrow('Proposal cannot be empty');
    });

    it('should reject negative rate update', async () => {
      const updateData = {
        proposedRate: -100
      };

      await expect(
        applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData)
      ).rejects.toThrow('Proposed rate must be positive');
    });
  });
});

