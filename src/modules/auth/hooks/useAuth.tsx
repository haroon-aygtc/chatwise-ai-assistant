
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import AuthService from '../services/authService';
import tokenService from '../services/tokenService';

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (tokenService.validateToken()) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenService.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password);
      tokenService.setToken(response.token, rememberMe);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return user.roles.some(userRole => roles.includes(userRole.name));
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;
    
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some(p => user.permissions?.includes(p));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
