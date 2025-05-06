export const handleAuthError = (error: any) => {
  console.error("Authentication error:", error);
  throw error;
};
