
import apiService, { ApiParams } from "../api/api";
import { User, EditedUser, NewUser } from "@/types/domain";
import { ApiRequestParams, PaginatedResponse } from "../api/types";

class UserService {
  /**
   * Get a paginated list of users
   */
  static async getUsers(
    params: ApiParams = {}
  ): Promise<PaginatedResponse<User>> {
    return await apiService.get<PaginatedResponse<User>>("/users", params);
  }

  /**
   * Get a single user by ID
   */
  static async getUser(id: string): Promise<User> {
    return await apiService.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  static async createUser(
    userData: NewUser
  ): Promise<{ user: User; message: string }> {
    return await apiService.post<{ user: User; message: string }>(
      "/users",
      userData
    );
  }

  /**
   * Update an existing user
   */
  static async updateUser(
    id: string,
    userData: Partial<EditedUser>
  ): Promise<{ user: User; message: string }> {
    return await apiService.put<{ user: User; message: string }>(
      `/users/${id}`,
      userData
    );
  }

  /**
   * Delete a user
   */
  static async deleteUser(
    id: string
  ): Promise<{ message: string }> {
    return await apiService.delete<{ message: string }>(
      `/users/${id}`
    );
  }

  /**
   * Update user status
   */
  static async updateUserStatus(
    id: string,
    status: "active" | "inactive" | "pending" | "suspended"
  ): Promise<{ user: User; message: string }> {
    return await apiService.put<{ user: User; message: string }>(
      `/users/${id}/status`,
      { status }
    );
  }

  /**
   * Assign roles to a user
   */
  static async assignRoles(
    id: string,
    roles: string[]
  ): Promise<{ user: User; message: string }> {
    return await apiService.put<{ user: User; message: string }>(
      `/users/${id}/assign-roles`,
      { roles }
    );
  }

  /**
   * Reset a user's password (admin only)
   */
  static async resetPassword(
    id: string,
    password: string
  ): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>(
      `/users/${id}/reset-password`,
      { password }
    );
  }
}

export default UserService;
