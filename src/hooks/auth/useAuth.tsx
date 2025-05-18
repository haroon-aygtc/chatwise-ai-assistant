import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/user';
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
    if (isLoading) return; // Prevent multiple simultaneous refresh attempts

    setIsLoading(true);
    try {
      // With Sanctum, we don't validate tokens locally but check session status
      console.log('Refreshing authentication state...');
      const userData = await authService.getCurrentUser() as any;
      // Convert the authService User to our domain User
      setUser({
        ...userData,
        id: String(userData.id), // Convert number id to string
      } as User);
      console.log('Authentication refreshed successfully:', userData);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        await tokenService.initCsrfToken(); // Make sure CSRF token is initialized first

        try {
          const userData = await authService.getCurrentUser() as any;
          console.log('User data fetched successfully:', userData);
          // Convert the authService User to our domain User
          setUser({
            ...userData,
            id: String(userData.id), // Convert number id to string
          } as User);
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          // Not authenticated or session expired
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // This effect should only run once on mount

  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Make sure CSRF token is initialized first
      await tokenService.initCsrfToken();

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

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signup function
  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Make sure CSRF token is initialized first
      await tokenService.initCsrfToken();

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

      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has a specific role
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    if (Array.isArray(role)) {
      return role.some(r => {
        const roleNames = Array.isArray(user.roles)
          ? user.roles.map(userRole =>
            typeof userRole === 'object' && userRole.name ? userRole.name : userRole
          )
          : [];
        return roleNames.includes(r);
      });
    }

    const roleNames = Array.isArray(user.roles)
      ? user.roles.map(userRole =>
        typeof userRole === 'object' && userRole.name ? userRole.name : userRole
      )
      : [];
    return roleNames.includes(role);
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string | string[]): boolean => {
    if (!user) return false;

    // Special case: admin users always have all permissions
    if (user.roles && Array.isArray(user.roles)) {
      const isAdmin = user.roles.some(role => {
        const roleName = typeof role === 'object' && role.name ? role.name : role;
        return roleName === 'admin';
      });

      if (isAdmin) return true;
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
        return { ...prevUser, ...userData };
      } else {
        return userData as User;
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      signup,
      hasRole,
      hasPermission,
      updateUser,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
