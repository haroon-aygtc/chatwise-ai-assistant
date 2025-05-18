import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, tokenService } from '@/services/auth';
import { User, Role } from '@/types/domain';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  updateUser: (userData: User) => void;
  refreshAuth: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  [key: string]: any; // Allow for additional fields
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Check if token exists and is valid
        if (tokenService.getToken() && tokenService.validateToken()) {
          // Get user data from token or API
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        // Clear invalid tokens
        tokenService.clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string, remember: boolean) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password, remember);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    const userRoles = user.roles.map(r => r.name);

    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }

    return userRoles.includes(role);
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;

    if (Array.isArray(permission)) {
      return permission.some(p => user.permissions.includes(p));
    }

    return user.permissions.includes(permission);
  };

  // Update user data
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Refresh authentication
  const refreshAuth = async () => {
    setIsLoading(true);
    try {
      // Refresh token if needed
      await tokenService.refreshToken();

      // Get updated user data
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth refresh error:', error);
      // If refresh fails, log out
      setUser(null);
      tokenService.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    hasRole,
    hasPermission,
    updateUser,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Export the hook and provider
export default useAuth;
