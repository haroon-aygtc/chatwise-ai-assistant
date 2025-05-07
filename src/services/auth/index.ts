import * as authServiceExports from './authService';
import tokenService from './tokenService';

// Re-export all named exports from authService
export * from './authService';

// Re-export tokenService
export { tokenService };

// Create and export an AuthService object with all the functions
const AuthService = {
    ...authServiceExports
};

// Export AuthService as both default and named export
export { AuthService };
export default AuthService;
