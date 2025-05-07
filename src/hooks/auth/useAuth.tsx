
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/user';
import { Role } from '@/types';
import { AuthService, tokenService } from '@/services/auth';
import { SignupData } from '@/services/auth/types';
import { useToast } from '@/components/ui/use-toast';

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<boolean>;
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

  // Define logout function with useCallback to avoid dependency issues
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, [toast]);

  // Function to refresh authentication status
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      if (tokenService.validateToken()) {
        const userData = await AuthService.getCurrentUser();
        // Convert the authService User to our domain User
        setUser({
          ...userData,
          id: String(userData.id), // Convert number id to string
        } as User);
      } else {
        setUser(null);
        tokenService.clearToken();
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
      tokenService.clearToken();
    }
  }, []);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (tokenService.validateToken()) {
          const userData = await AuthService.getCurrentUser();
          // Convert the authService User to our domain User
          setUser({
            ...userData,
            id: String(userData.id), // Convert number id to string
          } as User);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenService.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // This effect should only run once on mount

  // Set up token expiry check in a separate effect
  useEffect(() => {
    // Set up token expiry check interval
    const tokenCheckInterval = setInterval(() => {
      // If token is expired, trigger a logout
      if (user && tokenService.isTokenExpired()) {
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
  }, [user, logout, toast]); // Add dependencies to avoid stale closures

  // Login function
  const login = useCallback(async (email: string, password: string, _rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      // AuthService.login only takes email and password
      const response = await AuthService.login(email, password);

      // Convert the response to our domain User type
      setUser({
        ...response,
        id: String(response.id), // Convert number id to string
      } as User);

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.name}!`,
        duration: 3000,
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to login. Please check your credentials.';
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
  }, [toast]);

  // Signup function
  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(data);

      // Convert the response to our domain User type
      setUser({
        ...response,
        id: String(response.id), // Convert number id to string
      } as User);

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
        duration: 3000,
      });
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
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
  }, [toast]);

  // Check if user has a specific role
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    if (Array.isArray(role)) {
      return role.some(r => {
        const roleNames = (user.roles as Role[]).map(role => role.name);
        return roleNames.includes(r);
      });
    }

    const roleNames = (user.roles as Role[]).map(r => r.name);
    return roleNames.includes(role);
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;

    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some(p => user.permissions?.includes(p));
  }, [user]);

  // Update user data
  const updateUser = useCallback((userData: Partial<User>): void => {
    setUser(prevUser => {
      if (prevUser) {
        // If we already have a user, update their properties
        return { ...prevUser, ...userData };
      } else {
        // If we don't have a user yet (like during mock login),
        // create a new user object with the provided data
        return userData as User;
      }
    });
  }, []);

  const value: AuthContextType = {
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
