import ApiService from './base';

interface CsrfCheckResult {
  success: boolean;
  message: string;
  tokenMatch?: boolean;
  csrfTokenHeader?: string;
  csrfTokenCookie?: string;
}

export const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await ApiService.get<{ csrf_token: string }>("/csrf-token");
    return response.csrf_token || '';
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return '';
  }
};

export const testCsrfProtection = async (testData: any): Promise<CsrfCheckResult> => {
  try {
    const response = await ApiService.post<CsrfCheckResult>("/csrf-test", testData);
    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "CSRF test failed",
    };
  }
};

export const getServerConfig = async (): Promise<any> => {
  try {
    const response = await ApiService.get<any>("/config");
    return response;
  } catch (error) {
    console.error('Error getting server config:', error);
    return {};
  }
};

export const runCsrfDiagnostics = async (): Promise<void> => {
  console.log("Starting CSRF diagnostics...");
  console.log("API Base URL:", import.meta.env.VITE_API_URL || "http://localhost:8000/api");
  
  try {
    // Test CSRF token fetch
    console.log("Making request to:", import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/sanctum/csrf-cookie` : "http://localhost:8000/sanctum/csrf-cookie");
    
    const csrfUrl = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/sanctum/csrf-cookie` 
      : "http://localhost:8000/sanctum/csrf-cookie";
    
    const response = await fetch(csrfUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
      mode: "cors",
    });
    
    console.log("Response status:", response.status);
    
    // Check cookies
    const cookies = document.cookie;
    console.log("Cookies after request:", cookies);
    
    const xsrfCookie = cookies.split(";").find(cookie => cookie.trim().startsWith("XSRF-TOKEN="));
    console.log("XSRF-TOKEN cookie found:", !!xsrfCookie);
    
    if (xsrfCookie) {
      // The cookie value is URL encoded, so we need to decode it
      const token = decodeURIComponent(xsrfCookie.split("=")[1]);
      console.log("XSRF token value:", token.substring(0, 10) + "...");
    }
    
    // Try a test request with CSRF token
    if (xsrfCookie) {
      await testCsrfEndpoint();
    }
  } catch (error) {
    console.error("CSRF diagnostics error:", error);
  }
};

export const testCsrfEndpoint = async (): Promise<void> => {
  try {
    console.log("Testing CSRF protection...");
    
    // Get the XSRF-TOKEN cookie
    const xsrfCookie = document.cookie.split(";").find(cookie => cookie.trim().startsWith("XSRF-TOKEN="));
    
    if (!xsrfCookie) {
      console.error("No XSRF-TOKEN cookie found, cannot test CSRF protection");
      return;
    }
    
    // Decode the token
    const token = decodeURIComponent(xsrfCookie.split("=")[1]);
    
    // Prepare headers with X-XSRF-TOKEN
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": token,
    };
    
    // Make a test request to a CSRF-protected endpoint
    const testUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/csrf-test` : "http://localhost:8000/api/csrf-test";
    
    console.log("Making CSRF test request to:", testUrl);
    console.log("Using CSRF token:", token.substring(0, 10) + "...");
    
    const response = await fetch(testUrl, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ test: "data" }),
    });
    
    const result = await response.json();
    
    console.log("CSRF test response:", result);
    console.log("CSRF protection is " + (result.success ? "working correctly" : "not working"));
  } catch (error) {
    console.error("CSRF test error:", error);
  }
};
