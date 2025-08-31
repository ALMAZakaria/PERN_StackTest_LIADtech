import api, { 
  ApiResponse, 
  FreelanceProfile, 
  CompanyProfile, 
  Mission, 
  Application, 
  Rating, 
  PortfolioProject, 
  Notification
} from './api';

class SkillBridgeService {
  // Freelance Profile Management
  async getFreelanceProfile(): Promise<FreelanceProfile> {
    const response = await api.get<ApiResponse<FreelanceProfile>>('/freelance/profile');
    return response.data.data!;
  }

  async updateFreelanceProfile(profile: Partial<FreelanceProfile>): Promise<FreelanceProfile> {
    const response = await api.put<ApiResponse<FreelanceProfile>>('/freelance/profile', profile);
    return response.data.data!;
  }

  async searchFreelancers(filters: {
    skills?: string[];
    minRate?: number;
    maxRate?: number;
    location?: string;
    experience?: number;
  }): Promise<FreelanceProfile[]> {
    const response = await api.get<ApiResponse<FreelanceProfile[]>>('/freelance/search', { params: filters });
    return response.data.data!;
  }

  // Company Profile Management
  async getCompanyProfile(): Promise<CompanyProfile> {
    const response = await api.get<ApiResponse<CompanyProfile>>('/company/profile');
    return response.data.data!;
  }

  async updateCompanyProfile(profile: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const response = await api.put<ApiResponse<CompanyProfile>>('/company/profile', profile);
    return response.data.data!;
  }

  async searchCompanies(filters: {
    industry?: string;
    size?: string;
    location?: string;
  }): Promise<CompanyProfile[]> {
    const response = await api.get<ApiResponse<CompanyProfile[]>>('/company/search', { params: filters });
    return response.data.data!;
  }

  // Mission Management
  async getMissions(filters?: {
    status?: string;
    skills?: string[];
    minBudget?: number;
    maxBudget?: number;
    location?: string;
    isRemote?: boolean;
  }): Promise<Mission[]> {
    const response = await api.get<ApiResponse<Mission[]>>('/missions', { params: filters });
    return response.data.data!;
  }

  async getMission(id: string): Promise<Mission> {
    const response = await api.get<ApiResponse<Mission>>(`/missions/${id}`);
    return response.data.data!;
  }

  async createMission(mission: Partial<Mission>): Promise<Mission> {
    const response = await api.post<ApiResponse<Mission>>('/missions', mission);
    return response.data.data!;
  }

  async updateMission(id: string, mission: Partial<Mission>): Promise<Mission> {
    const response = await api.put<ApiResponse<Mission>>(`/missions/${id}`, mission);
    return response.data.data!;
  }

  async deleteMission(id: string): Promise<void> {
    await api.delete(`/missions/${id}`);
  }

  async getCompanyMissions(): Promise<Mission[]> {
    const response = await api.get<ApiResponse<Mission[]>>('/missions/company/my-missions');
    return response.data.data!;
  }

  // Application Management
  async getApplications(): Promise<Application[]> {
    const response = await api.get<ApiResponse<Application[]>>('/applications/user/my-applications');
    return response.data.data!;
  }

  async getMissionApplications(missionId: string): Promise<Application[]> {
    const response = await api.get<ApiResponse<Application[]>>(`/applications/mission/${missionId}`);
    return response.data.data!;
  }

  async createApplication(application: {
    missionId: string;
    proposal: string;
    proposedRate: number;
    estimatedDuration: number;
  }): Promise<Application> {
    const response = await api.post<ApiResponse<Application>>('/applications', application);
    return response.data.data!;
  }

  async updateApplication(id: string, application: Partial<Application>): Promise<Application> {
    const response = await api.put<ApiResponse<Application>>(`/applications/${id}`, application);
    return response.data.data!;
  }

  async deleteApplication(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  }

  // Rating Management
  async getRatings(): Promise<Rating[]> {
    const response = await api.get<ApiResponse<Rating[]>>('/ratings/user/my-ratings');
    return response.data.data!;
  }

  async createRating(rating: {
    applicationId: string;
    rating: number;
    comment?: string;
  }): Promise<Rating> {
    const response = await api.post<ApiResponse<Rating>>('/ratings', rating);
    return response.data.data!;
  }

  async getUserAverageRating(userId: string): Promise<{ average: number; count: number }> {
    const response = await api.get<ApiResponse<{ average: number; count: number }>>(`/ratings/user/${userId}/average`);
    return response.data.data!;
  }

  // Portfolio Management
  async getPortfolio(): Promise<PortfolioProject[]> {
    const response = await api.get<ApiResponse<PortfolioProject[]>>('/portfolio/user/my-portfolio');
    return response.data.data!;
  }

  async createPortfolioProject(project: Partial<PortfolioProject>): Promise<PortfolioProject> {
    const response = await api.post<ApiResponse<PortfolioProject>>('/portfolio', project);
    return response.data.data!;
  }

  async updatePortfolioProject(id: string, project: Partial<PortfolioProject>): Promise<PortfolioProject> {
    const response = await api.put<ApiResponse<PortfolioProject>>(`/portfolio/${id}`, project);
    return response.data.data!;
  }

  async deletePortfolioProject(id: string): Promise<void> {
    await api.delete(`/portfolio/${id}`);
  }

  // Skills Management
  async getSkills(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/skills');
    return response.data.data!;
  }

  async searchSkills(query: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/skills/search', { params: { q: query } });
    return response.data.data!;
  }

  async validateSkills(skills: string[]): Promise<{ valid: string[]; invalid: string[] }> {
    const response = await api.post<ApiResponse<{ valid: string[]; invalid: string[] }>>('/skills/validate', { skills });
    return response.data.data!;
  }

  // Notification Management
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data!;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/notifications/unread-count');
    return response.data.data!;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalMissions: number;
    activeApplications: number;
    completedProjects: number;
    averageRating: number;
    earnings?: number;
    postedMissions?: number;
  }> {
    const response = await api.get<ApiResponse<any>>('/dashboard/statistics');
    return response.data.data!;
  }
}

export const skillbridgeService = new SkillBridgeService();
export default skillbridgeService;
