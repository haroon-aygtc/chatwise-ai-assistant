export const getRoleBadgeVariant = (role?: string) => {
  // Handle undefined or null roles
  if (!role) return "secondary";

  switch (role.toLowerCase()) {
    case "admin":
      return "default"; // Primary color - stands out for admins
    case "manager":
      return "success"; // Green for managers
    case "editor":
      return "secondary"; // Secondary color for editors
    case "user":
      return "outline"; // Outline style for regular users
    default:
      return "outline";
  }
};

export const handlePermissionChange = (
  permissionId: string,
  checked: boolean,
  currentPermissions: string[],
  setSelectedPermissions: (permissions: string[]) => void
) => {
  if (checked) {
    setSelectedPermissions([...currentPermissions, permissionId]);
  } else {
    setSelectedPermissions(currentPermissions.filter(id => id !== permissionId));
  }
};

export const handleApiError = (error: unknown): void => {
  console.error("API Error:", error);

  let errorMessage = "An unexpected error occurred";

  if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String(error.message);
  }

  // Toast notification or other error handling here
  console.error(errorMessage);
};

// Add getCookie function for CsrfDebugger
export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

/**
 * Safely formats a date string with fallback for invalid dates
 * @param dateString The date string to format
 * @param format The format to use (default: 'localeDate')
 * @returns Formatted date string or fallback message
 */
export const formatDate = (
  dateString?: string | null,
  format: 'localeDate' | 'localeDateTime' | 'relative' = 'localeDate'
): string => {
  if (!dateString) return 'Never logged in';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Format based on requested format
    switch (format) {
      case 'localeDate':
        return date.toLocaleDateString();
      case 'localeDateTime':
        return date.toLocaleString();
      case 'relative':
        // Simple relative time formatting
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            if (diffMinutes === 0) {
              return 'Just now';
            }
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
          }
          return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
          return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
          return date.toLocaleDateString();
        }
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
