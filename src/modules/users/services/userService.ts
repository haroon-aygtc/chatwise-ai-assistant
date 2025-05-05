
import ApiService from '@/services/api/base';
import { User, NewUser, EditedUser } from '@/types/user';

/**
 * Service for user management operations
 */
export const getUserList = async (): Promise<User[]> => {
  try {
    const response = await ApiService.get<User[]>('/users');
    return response || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await ApiService.get<User>(`/users/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
};

export const createUser = async (userData: NewUser): Promise<User> => {
  const response = await ApiService.post<User>('/users', userData);
  return response;
};

export const updateUser = async (id: string, userData: EditedUser): Promise<User> => {
  const response = await ApiService.put<User>(`/users/${id}`, userData);
  return response;
};

export const deleteUser = async (id: string): Promise<void> => {
  await ApiService.delete(`/users/${id}`);
};

export const getUserPermissions = async (id: string): Promise<string[]> => {
  try {
    const response = await ApiService.get<string[]>(`/users/${id}/permissions`);
    return response || [];
  } catch (error) {
    console.error(`Error fetching permissions for user ${id}:`, error);
    return [];
  }
};

const userService = {
  getUserList,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
};

export default userService;
