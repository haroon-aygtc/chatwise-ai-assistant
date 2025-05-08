import authService, * as authServiceExports from './authService';
import tokenService from './tokenService';

// Re-export all named exports from authService
export * from './authService';

// Re-export tokenService
export { tokenService };

// Export authService as both default and named export
export { authService as AuthService };
export default authService;
