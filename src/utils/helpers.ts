export const getRoleBadgeVariant = (role?: string | null) => {
  if (!role) return "secondary"; // Default for undefined or null roles

  switch (role.toLowerCase()) {
    case "admin":
      return "default";
    case "manager":
      return "outline";
    case "editor":
      return "secondary";
    case "user":
      return "secondary"; // Changed from "ghost" to "secondary"
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
