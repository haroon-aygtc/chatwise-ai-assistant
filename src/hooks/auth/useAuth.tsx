import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/user';
import { Role } from '@/types';
import authService, { tokenService } from '@/services/auth';
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
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Define logout function with useCallback to avoid dependency issues
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      // Toast is now handled in authService
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Error toast is handled in authService
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to refresh authentication status
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      if (tokenService.validateToken()) {
        const userData = await authService.getCurrentUser();
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
          console.log('Token is valid, fetching user data...');
          try {
            const userData = await authService.getCurrentUser();
            console.log('User data fetched successfully:', userData);
            // Convert the authService User to our domain User
            setUser({
              ...userData,
              id: String(userData.id), // Convert number id to string
            } as User);
          } catch (userError) {
            console.error('Failed to fetch user data:', userError);
            // If we can't fetch the user data, clear the token
            tokenService.clearToken();
            setUser(null);
          }
        } else {
          console.log('No valid token found');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenService.clearToken();
        setUser(null);
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
  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        email,
        password,
        remember: rememberMe
      });

      // Convert the response to our domain User type
      setUser({
        ...response.user,
        id: String(response.user.id),
      } as User);

      // Toast is now handled in authService
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Error toast is handled in authService
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signup function
  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation
      });

      // Convert the response to our domain User type
      setUser({
        ...response.user,
        id: String(response.user.id), // Convert number id to string
      } as User);

      // Toast is now handled in authService
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      // Error toast is handled in authService
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has a specific role
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user || !user.roles) return false; // Return false if user or roles are not defined

    if (Array.isArray(role)) {
      return role.some(r => {
        const roleNames = (user.roles as Role[]).map(role => role.name || role);
        return roleNames.includes(r);
      });
    }

    const roleNames = (user.roles as Role[]).map(role => role.name || role);
    return roleNames.includes(role);
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string | string[]): boolean => {
    if (!user) return false; // Return false if user is not defined

    // Special case: admin users always have access to admin panel
    if (user.roles && Array.isArray(user.roles)) {
      const isAdmin = user.roles.some(role =>
        (typeof role === 'object' && role.name === 'admin') || role.name === 'admin'
      );

      if (isAdmin) {
        const adminPanelPermissions = ['access admin panel', 'access_admin_panel'];
        if (Array.isArray(permission)) {
          if (permission.some(p => adminPanelPermissions.includes(p))) {
            return true;
          }
        } else if (adminPanelPermissions.includes(permission)) {
          return true;
        }
      }
    }

    // Regular permission check
    if (!user.permissions) return false;

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
}

// Hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
