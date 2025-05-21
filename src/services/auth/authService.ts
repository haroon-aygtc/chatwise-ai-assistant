/**
 * Legacy Auth Service
 *
 * This file is maintained for backward compatibility.
 * New code should use the modular auth service from @/core/auth/authService.
 */

import { authService as coreAuthService } from "@/core/auth/authService";
import AuthService from "@/core/auth/authService";

// Re-export the auth service for backward compatibility
export const authService = coreAuthService;

// Re-export the auth service class for backward compatibility
export default AuthService;
