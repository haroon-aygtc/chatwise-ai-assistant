
import { toast } from "sonner";
import { ApiError, ValidationError, AuthError } from "@/modules/common/services/api/errors";

/**
 * Handle authentication related errors in a user-friendly way
 * 
 * @param error Any error thrown during authentication processes
 */
export const handleAuthError = (error: any) => {
  console.error("Authentication error:", error);
  
  let message = "An unexpected error occurred during authentication";

  if (error instanceof ValidationError) {
    // Handle validation errors
    const firstError = Object.values(error.errors || {})[0];
    message = Array.isArray(firstError) ? firstError[0] : "Validation failed";
    
    toast.error("Authentication Error", {
      description: message
    });
  } else if (error instanceof AuthError) {
    // Handle authentication specific errors
    message = error.message || "Authentication failed";
    
    toast.error("Authentication Error", {
      description: message
    });
  } else if (error instanceof ApiError) {
    // Handle general API errors
    message = error.message;
    
    toast.error("API Error", {
      description: message
    });
  } else if (error?.response?.data?.message) {
    // Handle axios error responses
    message = error.response.data.message;
    
    toast.error("Server Error", {
      description: message
    });
  }
  
  throw error;
};
