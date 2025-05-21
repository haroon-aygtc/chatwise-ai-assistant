/**
 * Legacy API Service
 *
 * This file is maintained for backward compatibility.
 * New code should use the modular API services from @/core/api.
 */

import { apiService as coreApiService } from "@/core/api/service";
import ApiService from "@/core/api/service";

// Re-export the core API service for backward compatibility
export const apiService = coreApiService;

// Re-export the API service class for backward compatibility
export default ApiService;
