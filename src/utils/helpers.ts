import { useToast } from "@/components/ui/use-toast";
import { Role } from '@/types/domain';

/**
 * Helper function for handling permission changes in UI components
 */
export const handlePermissionChange = (
  permissionId: string,
  isChecked: boolean,
  setState: Function,
  currentState: any
) => {
  if (isChecked) {
    // Add the permission if it's not already in the array
    if (!currentState.permissions.includes(permissionId)) {
      setState({
        ...currentState,
        permissions: [...currentState.permissions, permissionId],
      });
    }
  } else {
    // Remove the permission if it's in the array
    setState({
      ...currentState,
      permissions: currentState.permissions.filter((id: string) => id !== permissionId),
    });
  }
};

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Generate initials from a name
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Add or remove item from array
 */
export const toggleArrayItem = <T>(array: T[], item: T): T[] => {
  const index = array.indexOf(item);
  
  if (index === -1) {
    return [...array, item];
  }
  
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

/**
 * Helper function to get a role badge variant
 */
export const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (role.toLowerCase()) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    case "editor":
      return "secondary";
    default:
      return "outline";
  }
};

/**
 * Generic error handler for API operations
 */
export const handleApiError = (error: unknown, setError: (error: string | null) => void, toast: unknown, message: string): boolean => {
  setError(error.message || message);
  toast({
    title: "Error",
    description: error.message || message,
    variant: "destructive",
  });
  return false;
};

/**
 * Update role state in array
 */
export const updateRoleState = (roles: Role[], updatedRole: Role): Role[] => {
  return roles.map(role => role.id === updatedRole.id ? updatedRole : role);
};

/**
 * Toggle loading state
 */
export const toggleLoadingState = (setState: (state: boolean) => void) => {
  return (isLoading: boolean) => {
    setState(isLoading);
  };
};
