
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import AuthService, { UserResponse } from '../services/authService';
import tokenService from '../services/tokenService';
import { useToast } from '@/components/ui/use-toast';

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<boolean>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
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
  const { toast } = useToast();

  // Function to refresh authentication status
  const refreshAuth = async (): Promise<void> => {
    try {
      if (tokenService.validateToken()) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
      tokenService.clearToken();
    }
  };

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
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

    initializeAuth();

    // Set up token expiry check interval
    const tokenCheckInterval = setInterval(() => {
      // If token is expired, trigger a logout
      if (!!user && tokenService.isTokenExpired()) {
        console.log('Token expired during session, logging out...');
        logout();
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [user]);

  // Login function
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password, remember: rememberMe });
      tokenService.setToken(response.token, rememberMe);
      setUser(response.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
        duration: 3000,
      });
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.message || 'Failed to login. Please check your credentials.';
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(data);
      setUser(response);
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
        duration: 3000,
      });
      return true;
    } catch (error: any) {
      console.error('Signup failed:', error);
      const message = error.message || 'Registration failed. Please try again.';
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function (alias for signup with specific parameters)
  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<boolean> => {
    return signup({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation
    });
  };

  // Update user data
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearToken();
      setUser(null);
      setIsLoading(false);
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
        duration: 3000,
      });
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
    signup,
    register,
    hasRole,
    hasPermission,
    updateUser,
    refreshAuth,
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
