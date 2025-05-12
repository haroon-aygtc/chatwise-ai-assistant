export const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "default";
    case "manager":
      return "outline";
    case "editor":
      return "secondary";
    case "user":
      return "ghost";
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
