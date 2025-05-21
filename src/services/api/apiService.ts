import httpClient from './api';
import API_CONFIG from './config';

/**
 * Configuration for API requests
 */
interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
    requiresAuth?: boolean;
}

/**
 * Base API Service using the centralized HTTP client
 * 
 * This service provides a clean interface to the HTTP client,
 * with built-in path construction for modular services
 */
class ApiService {
    private basePath: string;
    private fullBasePath: string;

    /**
     * Create a new API service instance
     * @param basePath - Service-specific base path (e.g., '/ai' for AI services)
     */
    constructor(basePath: string = '') {
        // Normalize basePath to ensure it starts with a slash if not empty
        this.basePath = basePath ? (basePath.startsWith('/') ? basePath : `/${basePath}`) : '';

        // Construct the full base path by combining the API base URL and service path
        // Ensure we don't have double slashes when joining paths
        const baseUrl = API_CONFIG.BASE_URL.endsWith('/')
            ? API_CONFIG.BASE_URL.slice(0, -1)
            : API_CONFIG.BASE_URL;

        this.fullBasePath = `${baseUrl}${this.basePath}`;

        if (API_CONFIG.DEBUG) {
            console.log(`API Service initialized:`);
            console.log(`- Base URL: ${API_CONFIG.BASE_URL}`);
            console.log(`- Service path: ${this.basePath}`);
            console.log(`- Full path: ${this.fullBasePath}`);
        }
    }

    /**
     * Creates endpoint path by joining basePath and endpoint
     */
    protected createEndpoint(endpoint: string): string {
        // Ensure endpoint starts with a slash if not empty and remove leading slash if present
        const path = endpoint
            ? (endpoint.startsWith('/') ? endpoint : `/${endpoint}`)
            : '';

        const result = `${this.basePath}${path}`;

        if (API_CONFIG.DEBUG) {
            console.log(`Creating endpoint: ${result} (from ${this.basePath} + ${endpoint})`);
        }

        return result;
    }

    /**
     * Sends GET request
     */
    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const path = this.createEndpoint(endpoint);
        if (API_CONFIG.DEBUG) {
            console.log(`GET ${path}`);
        }
        return httpClient.get<T>(path, { params });
    }

    /**
     * Sends POST request
     */
    async post<T>(endpoint: string, data?: any): Promise<T> {
        const path = this.createEndpoint(endpoint);
        if (API_CONFIG.DEBUG) {
            console.log(`POST ${path}`);
        }
        return httpClient.post<T>(path, data);
    }

    /**
     * Sends PUT request
     */
    async put<T>(endpoint: string, data?: any): Promise<T> {
        const path = this.createEndpoint(endpoint);
        if (API_CONFIG.DEBUG) {
            console.log(`PUT ${path}`);
        }
        return httpClient.put<T>(path, data);
    }

    /**
     * Sends PATCH request
     */
    async patch<T>(endpoint: string, data?: any): Promise<T> {
        const path = this.createEndpoint(endpoint);
        if (API_CONFIG.DEBUG) {
            console.log(`PATCH ${path}`);
        }
        return httpClient.patch<T>(path, data);
    }

    /**
     * Sends DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        const path = this.createEndpoint(endpoint);
        if (API_CONFIG.DEBUG) {
            console.log(`DELETE ${path}`);
        }
        return httpClient.delete<T>(path);
    }

    /**
     * Uploads a file
     */
    async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
        const path = this.createEndpoint(endpoint);
        if (API_CONFIG.DEBUG) {
            console.log(`UPLOAD ${path}`);
        }
        return httpClient.uploadFile<T>(path, formData);
    }
}

// Create and export a single instance with no base path
export const apiService = new ApiService();

// Export the class for extending
export default ApiService; 