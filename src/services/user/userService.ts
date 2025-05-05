
import ApiService from '../api/base';
import { User, EditedUser, NewUser } from '@/types/user';

interface UserListResponse {
  data: User[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

class UserService {
  /**
   * Get a paginated list of users
   */
  static async getUsers(params: {
    page?: number;
    per_page?: number;
    role?: string;
    status?: string;
    search?: string;
  } = {}): Promise<UserListResponse> {
    return ApiService.get<UserListResponse>('/users', params);
  }

  /**
   * Get a single user by ID
   */
  static async getUser(id: string): Promise<User> {
    return ApiService.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  static async createUser(userData: NewUser): Promise<{ user: User; message: string }> {
    return ApiService.post<{ user: User; message: string }>('/users', userData);
  }

  /**
   * Update an existing user
   */
  static async updateUser(id: string, userData: Partial<EditedUser>): Promise<{ user: User; message: string }> {
    return ApiService.put<{ user: User; message: string }>(`/users/${id}`, userData);
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: string): Promise<{ message: string }> {
    return ApiService.delete<{ message: string }>(`/users/${id}`);
  }

  /**
   * Update user status
   */
  static async updateUserStatus(id: string, status: string): Promise<{ user: User; message: string }> {
    return ApiService.put<{ user: User; message: string }>(`/users/${id}/status`, { status });
  }

  /**
   * Assign roles to a user
   */
  static async assignRoles(id: string, roles: string[]): Promise<{ user: User; message: string }> {
    return ApiService.put<{ user: User; message: string }>(`/users/${id}/assign-roles`, { roles });
  }
}

export default UserService;
