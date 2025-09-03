import api, { Application, ApiResponse } from './api';

export interface ApplicationFilters {
  status?: string;
  minRate?: number;
  maxRate?: number;
  minDuration?: number;
  maxDuration?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedApplicationsResponse {
  data: Application[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApplicationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  averageRate: number;
}

export interface CreateApplicationRequest {
  missionId: string;
  proposal: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export interface UpdateApplicationRequest {
  proposal?: string;
  proposedRate?: number;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}

class ApplicationService {
  // Get user's applications with pagination and filtering
  async getUserApplications(
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedApplicationsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<PaginatedApplicationsResponse>>(
      `/applications/user/my-applications/paginated?${params.toString()}`
    );
    return response.data.data!;
  }

  // Get applications for a specific mission with pagination and filtering
  async getMissionApplications(
    missionId: string,
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedApplicationsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<PaginatedApplicationsResponse>>(
      `/applications/mission/${missionId}/paginated?${params.toString()}`
    );
    return response.data.data!;
  }

  // Search applications with pagination and filtering
  async searchApplications(
    filters?: ApplicationFilters & {
      missionId?: string;
      freelancerId?: string;
      companyId?: string;
    },
    pagination?: PaginationOptions
  ): Promise<PaginatedApplicationsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<PaginatedApplicationsResponse>>(
      `/applications/search/paginated?${params.toString()}`
    );
    return response.data.data!;
  }

  // Get application statistics
  async getApplicationStats(): Promise<ApplicationStats> {
    const response = await api.get<ApiResponse<ApplicationStats>>('/applications/stats');
    return response.data.data!;
  }

  // Get a single application by ID
  async getApplication(id: string): Promise<Application> {
    const response = await api.get<ApiResponse<Application>>(`/applications/${id}`);
    return response.data.data!;
  }

  // Create a new application
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    const response = await api.post<ApiResponse<Application>>('/applications', data);
    return response.data.data!;
  }

  // Update an application
  async updateApplication(id: string, data: UpdateApplicationRequest): Promise<Application> {
    const response = await api.put<ApiResponse<Application>>(`/applications/${id}`, data);
    return response.data.data!;
  }

  // Delete an application
  async deleteApplication(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/applications/${id}`);
  }

  // Get user's applications (legacy method for backward compatibility)
  async getUserApplicationsLegacy(): Promise<Application[]> {
    const response = await api.get<ApiResponse<Application[]>>('/applications/user/my-applications');
    return response.data.data!;
  }

  // Get mission applications (legacy method for backward compatibility)
  async getMissionApplicationsLegacy(missionId: string): Promise<Application[]> {
    const response = await api.get<ApiResponse<Application[]>>(`/applications/mission/${missionId}`);
    return response.data.data!;
  }
}

export default new ApplicationService();
