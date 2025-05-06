import { useRoleManagement } from './useRoleManagement';

/**
 * A simplified hook that only provides roles data
 */
export function useRoles() {
  const { roles, isLoadingRoles: isLoading, rolesError: error, fetchRoles } = useRoleManagement();
  
  return {
    roles,
    isLoading,
    error,
    fetchRoles,
  };
}