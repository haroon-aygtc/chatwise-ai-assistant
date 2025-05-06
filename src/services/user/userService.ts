import ApiService, { ApiResponse } from "../api/base";
import { User, EditedUser, NewUser } from "@/types/domain";

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
  static async getUsers(
    params: {
      page?: number;
      per_page?: number;
      role?: string;
      status?: string;
      search?: string;
    } = {}
  ): Promise<ApiResponse<UserListResponse>> {
    const response = await ApiService.get<UserListResponse>("/users", params);
    return { data: response.data };
  }

  /**
   * Get a single user by ID
   */
  static async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await ApiService.get<User>(`/users/${id}`);
    return { data: response.data };
  }

  /**
   * Create a new user
   */
  static async createUser(
    userData: NewUser
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    const response = await ApiService.post<{ user: User; message: string }>(
      "/users",
      userData
    );
    return { data: response.data };
  }

  /**
   * Update an existing user
   */
  static async updateUser(
    id: string,
    userData: Partial<EditedUser>
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    const response = await ApiService.put<{ user: User; message: string }>(
      `/users/${id}`,
      userData
    );
    return { data: response.data };
  }

  /**
   * Delete a user
   */
  static async deleteUser(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await ApiService.delete<{ message: string }>(
      `/users/${id}`
    );
    return { data: response.data };
  }

  /**
   * Update user status
   */
  static async updateUserStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    const response = await ApiService.put<{ user: User; message: string }>(
      `/users/${id}/status`,
      { status }
    );
    return { data: response.data };
  }

  /**
   * Assign roles to a user
   */
  static async assignRoles(
    id: string,
    roles: string[]
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    const response = await ApiService.put<{ user: User; message: string }>(
      `/users/${id}/assign-roles`,
      { roles }
    );
    return { data: response.data };
  }
}

export default UserService;
