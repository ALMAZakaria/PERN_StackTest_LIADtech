import api, { ApiResponse, User } from './api';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'moderator';
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface UsersResponse {
  users: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class UserService {
  // Get all users with filtering and pagination
  async getUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);

      const response = await api.get<ApiResponse<User[]>>(`/users?${queryParams.toString()}`);
      
      if (response.data.success && response.data.data) {
        return {
          users: response.data.data,
          meta: {
            page: response.data.meta?.page || params.page || 1,
            limit: response.data.meta?.limit || params.limit || 20,
            total: response.data.meta?.total || response.data.data.length,
            totalPages: response.data.meta?.totalPages || 1
          }
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch users';
      throw new Error(message);
    }
  }

  // Create new user (Admin only)
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>('/users/create', userData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create user');
      }
    } catch (error: any) {
      // Handle validation errors with detailed messages
      if (error.response?.data?.message === 'Validation failed' && error.response?.data?.data) {
        const validationErrors = error.response.data.data;
        const errorMessages = validationErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      
      const message = error.response?.data?.message || error.message || 'Failed to create user';
      throw new Error(message);
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user';
      throw new Error(message);
    }
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update user');
      }
    } catch (error: any) {
      // Handle validation errors with detailed messages
      if (error.response?.data?.message === 'Validation failed' && error.response?.data?.data) {
        const validationErrors = error.response.data.data;
        const errorMessages = validationErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      
      const message = error.response?.data?.message || error.message || 'Failed to update user';
      throw new Error(message);
    }
  }

  // Delete user (Admin only)
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse>(`/users/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete user';
      throw new Error(message);
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService; 