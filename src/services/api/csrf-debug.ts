
import { apiRequest } from "./base";

interface CsrfCheckResult {
  success: boolean;
  message: string;
  tokenMatch?: boolean;
  csrfTokenHeader?: string;
  csrfTokenCookie?: string;
}

export const getCsrfToken = async (): Promise<string> => {
  const response = await apiRequest<{ csrf_token: string }>({
    method: "GET",
    url: "/csrf-token",
  });
  
  return response.csrf_token;
};

export const testCsrfProtection = async (testData: any): Promise<CsrfCheckResult> => {
  try {
    const response = await apiRequest<CsrfCheckResult>({
      method: "POST",
      url: "/csrf-test",
      data: testData,
    });
    
    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "CSRF test failed",
    };
  }
};

export const getServerConfig = async (): Promise<any> => {
  const response = await apiRequest<any>({
    method: "GET",
    url: "/config",
  });
  
  return response;
};
