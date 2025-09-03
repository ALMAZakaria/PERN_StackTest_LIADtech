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

const mockCompanyRepository = {
  findByUserId: jest.fn()
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

jest.mock('../modules/company/repository/company.repository', () => ({
  CompanyRepository: jest.fn().mockImplementation(() => mockCompanyRepository)
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
      freelancerId: 'test-freelance-id',
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
      freelancerId: 'test-freelance-id',
      companyId: 'test-company-id',
      proposal: 'Test proposal',
      proposedRate: 500,
      status: 'PENDING'
    });
    mockApplicationRepository.update.mockImplementation((id, data) => {
      return Promise.resolve({
        id: 'test-application-id',
        missionId: 'test-mission-id',
        freelancerId: 'test-freelance-id',
        companyId: 'test-company-id',
        proposal: 'Test proposal',
        proposedRate: 500,
        status: data.status || 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      });
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

    mockCompanyRepository.findByUserId.mockResolvedValue({
      id: 'test-company-id',
      userId: 'test-company-user-id',
      companyName: 'Test Company',
      industry: 'Technology',
      size: 'Medium'
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

      const result = await applicationService.updateApplication('test-application-id', 'test-company-user-id', updateData);

      expect(result).toBeDefined();
      expect(result.status).toBe('ACCEPTED');
    });

    it('should reject empty proposal update', async () => {
      // Reset mocks for this specific test
      mockFreelanceRepository.findByUserId.mockResolvedValue({
        id: 'test-freelance-id',
        userId: 'test-freelancer-id',
        skills: ['JavaScript', 'React'],
        dailyRate: 100,
        availability: 40,
        experience: 3
      });

      // Mock no company profile for freelancer
      mockCompanyRepository.findByUserId.mockResolvedValue(null);

      const updateData = {
        proposal: ''
      };

      await expect(
        applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData)
      ).rejects.toThrow('Proposal cannot be empty');
    });

    it('should reject negative rate update', async () => {
      // Reset mocks for this specific test
      mockFreelanceRepository.findByUserId.mockResolvedValue({
        id: 'test-freelance-id',
        userId: 'test-freelancer-id',
        skills: ['JavaScript', 'React'],
        dailyRate: 100,
        availability: 40,
        experience: 3
      });

      // Mock no company profile for freelancer
      mockCompanyRepository.findByUserId.mockResolvedValue(null);

      const updateData = {
        proposedRate: -100
      };

      await expect(
        applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData)
      ).rejects.toThrow('Proposed rate must be positive');
    });

    describe('withdraw functionality', () => {
      beforeEach(() => {
        // Setup application owned by freelancer
        mockApplicationRepository.findById.mockResolvedValue({
          id: 'test-application-id',
          missionId: 'test-mission-id',
          freelancerId: 'test-freelance-id',
          companyId: 'test-company-id',
          proposal: 'Test proposal',
          proposedRate: 500,
          status: 'PENDING'
        });

        // Setup freelancer profile
        mockFreelanceRepository.findByUserId.mockResolvedValue({
          id: 'test-freelance-id',
          userId: 'test-freelancer-id',
          skills: ['JavaScript', 'React'],
          dailyRate: 100,
          availability: 40,
          experience: 3
        });

        // Setup company profile
        mockCompanyRepository.findByUserId.mockResolvedValue({
          id: 'test-company-id',
          userId: 'test-company-user-id',
          companyName: 'Test Company',
          industry: 'Technology',
          size: 'Medium'
        });
      });

      it('should allow freelancer to withdraw their own pending application', async () => {
        const updateData = {
          status: 'WITHDRAWN' as const
        };

        const result = await applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData);

        expect(result).toBeDefined();
        expect(result.status).toBe('WITHDRAWN');
        expect(mockApplicationRepository.update).toHaveBeenCalledWith('test-application-id', updateData);
      });

      it('should not allow freelancer to withdraw non-pending application', async () => {
        // Setup application with ACCEPTED status
        mockApplicationRepository.findById.mockResolvedValue({
          id: 'test-application-id',
          missionId: 'test-mission-id',
          freelancerId: 'test-freelance-id',
          companyId: 'test-company-id',
          proposal: 'Test proposal',
          proposedRate: 500,
          status: 'ACCEPTED'
        });

        const updateData = {
          status: 'WITHDRAWN' as const
        };

        await expect(
          applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData)
        ).rejects.toThrow('Only pending applications can be withdrawn');
      });

      it('should not allow freelancer to withdraw another freelancer\'s application', async () => {
        // Mock different freelancer profile
        mockFreelanceRepository.findByUserId.mockResolvedValue({
          id: 'different-freelance-id',
          userId: 'different-freelancer-id',
          skills: ['Python', 'Django'],
          dailyRate: 150,
          availability: 30,
          experience: 5
        });

        const updateData = {
          status: 'WITHDRAWN' as const
        };

        await expect(
          applicationService.updateApplication('test-application-id', 'different-freelancer-id', updateData)
        ).rejects.toThrow('Only freelancer can withdraw their own application');
      });

      it('should not allow company to withdraw application', async () => {
        // Mock no freelancer profile for company user
        mockFreelanceRepository.findByUserId.mockResolvedValue(null);

        const updateData = {
          status: 'WITHDRAWN' as const
        };

        await expect(
          applicationService.updateApplication('test-application-id', 'test-company-user-id', updateData)
        ).rejects.toThrow('Only freelancer can withdraw their own application');
      });

      it('should not allow unauthorized user to withdraw application', async () => {
        const updateData = {
          status: 'WITHDRAWN' as const
        };

        // Mock no profile found for unauthorized user
        mockFreelanceRepository.findByUserId.mockResolvedValue(null);
        mockCompanyRepository.findByUserId.mockResolvedValue(null);

        await expect(
          applicationService.updateApplication('test-application-id', 'unauthorized-user-id', updateData)
        ).rejects.toThrow('Not authorized to update this application');
      });
    });

    describe('accept/reject functionality', () => {
      beforeEach(() => {
        // Setup application owned by company
        mockApplicationRepository.findById.mockResolvedValue({
          id: 'test-application-id',
          missionId: 'test-mission-id',
          freelancerId: 'test-freelance-id',
          companyId: 'test-company-id',
          proposal: 'Test proposal',
          proposedRate: 500,
          status: 'PENDING'
        });
      });

      it('should allow company to accept pending application', async () => {
        const updateData = {
          status: 'ACCEPTED' as const
        };

        const result = await applicationService.updateApplication('test-application-id', 'test-company-user-id', updateData);

        expect(result).toBeDefined();
        expect(result.status).toBe('ACCEPTED');
        expect(mockApplicationRepository.update).toHaveBeenCalledWith('test-application-id', updateData);
      });

      it('should allow company to reject pending application', async () => {
        const updateData = {
          status: 'REJECTED' as const
        };

        const result = await applicationService.updateApplication('test-application-id', 'test-company-user-id', updateData);

        expect(result).toBeDefined();
        expect(result.status).toBe('REJECTED');
        expect(mockApplicationRepository.update).toHaveBeenCalledWith('test-application-id', updateData);
      });

      it('should not allow company to accept/reject non-pending application', async () => {
        // Setup application with ACCEPTED status
        mockApplicationRepository.findById.mockResolvedValue({
          id: 'test-application-id',
          missionId: 'test-mission-id',
          freelancerId: 'test-freelance-id',
          companyId: 'test-company-id',
          proposal: 'Test proposal',
          proposedRate: 500,
          status: 'ACCEPTED'
        });

        const updateData = {
          status: 'REJECTED' as const
        };

        await expect(
          applicationService.updateApplication('test-application-id', 'test-company-user-id', updateData)
        ).rejects.toThrow('Only pending applications can be accepted or rejected');
      });

      it('should not allow freelancer to accept/reject application', async () => {
        // Mock freelancer profile for this test
        mockFreelanceRepository.findByUserId.mockResolvedValue({
          id: 'test-freelance-id',
          userId: 'test-freelancer-id',
          skills: ['JavaScript', 'React'],
          dailyRate: 100,
          availability: 40,
          experience: 3
        });

        // Mock no company profile for freelancer
        mockCompanyRepository.findByUserId.mockResolvedValue(null);

        const updateData = {
          status: 'ACCEPTED' as const
        };

        await expect(
          applicationService.updateApplication('test-application-id', 'test-freelancer-id', updateData)
        ).rejects.toThrow('Only company can accept or reject applications');
      });

      it('should not allow different company to accept/reject application', async () => {
        // Mock different company profile
        mockCompanyRepository.findByUserId.mockResolvedValue({
          id: 'different-company-id',
          userId: 'different-company-user-id',
          companyName: 'Different Company',
          industry: 'Finance',
          size: 'Large'
        });

        const updateData = {
          status: 'ACCEPTED' as const
        };

        await expect(
          applicationService.updateApplication('test-application-id', 'different-company-user-id', updateData)
        ).rejects.toThrow('Only company can accept or reject applications');
      });
    });
  });
});

