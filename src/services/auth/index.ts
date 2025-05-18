import authService from './authService';
import tokenService from './tokenService';

// Re-export all named exports from authService
export * from './authService';

// Export both services
export { authService, tokenService };

// Export authService as named export for backward compatibility
export { authService as AuthService };

export default authService;
