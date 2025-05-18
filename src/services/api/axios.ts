
import axios from "axios";
import { API_BASE_URL } from "./config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Essential for cross-domain cookie handling
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle response errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?session=expired";
        }
      } else if (error.response.status === 419) {
        // CSRF token mismatch - try refreshing the token
        try {
          await axios.get(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
            withCredentials: true
          });
          // Retry the original request
          return axiosInstance(error.config);
        } catch (refreshError) {
          console.error("Failed to refresh CSRF token", refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
