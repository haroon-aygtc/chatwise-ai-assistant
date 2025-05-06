
export const handleAuthError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Authentication error response:", error.response.data);
    
    if (error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.response.status === 404) {
      throw new Error("API endpoint not found. Please check server configuration.");
    } else if (error.response.status === 422) {
      // Validation errors from Laravel
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          throw new Error(firstError[0]);
        }
      }
      throw new Error("Validation error. Please check your input.");
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Authentication error request:", error.request);
    throw new Error("No response received from server. Please check your connection.");
  }
  
  console.error("Authentication error:", error);
  throw error;
};
