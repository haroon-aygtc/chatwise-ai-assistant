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
    if (isLoading) return; // Prevent multiple simultaneous refresh attempts

    setIsLoading(true);
    console.log('Starting auth refresh');

    try {
      // Check if token exists and is valid
      const token = tokenService.getToken();
      const isValid = tokenService.validateToken();

      console.log(`Token check: exists=${!!token}, valid=${isValid}`);

      if (isValid) {
        console.log('Token is valid, fetching user data...');
        const userData = await authService.getCurrentUser();

        if (userData) {
          console.log('User data retrieved successfully during refresh');

          // Ensure permissions is always an array
          const permissions = Array.isArray(userData.permissions)
            ? userData.permissions
            : [];

          console.log("User permissions during refresh:", permissions);

          // Convert the authService User to our domain User
          setUser({
            ...userData,
            id: String(userData.id), // Convert number id to string
            permissions: permissions, // Ensure permissions is set
          } as User);
        } else {
          console.log('User data not found during refresh');
          setUser(null);
          tokenService.clearToken();
        }
      } else {
        console.log('Token is invalid or missing during refresh');
        setUser(null);
        tokenService.clearToken();
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
      tokenService.clearToken();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      console.log('Initializing authentication state');

      try {
        // Try to get token and check validity first
        const token = tokenService.getToken();
        const isValid = token ? tokenService.validateToken() : false;

        console.log(`Initial token check: exists=${!!token}, valid=${isValid}`);

        // Only initialize CSRF and fetch user data if we have a valid token
        if (isValid) {
          // Initialize CSRF token first (for Sanctum protection)
          try {
            await tokenService.initCsrfToken();
            console.log('CSRF token initialized successfully');
          } catch (csrfError) {
            console.warn('CSRF token initialization failed:', csrfError);
            // Continue anyway - this shouldn't prevent authentication check
          }

          console.log('Valid token found, fetching user data...');
          try {
            const userData = await authService.getCurrentUser();

            if (userData) {
              console.log('User data fetched during initialization:', {
                id: userData.id,
                hasRoles: !!userData.roles,
                roles: userData.roles ? (Array.isArray(userData.roles) ? userData.roles.length : 'object') : 'none'
              });

              // Ensure permissions is always an array
              const permissions = Array.isArray(userData.permissions)
                ? userData.permissions
                : [];

              console.log("User permissions during init:", permissions);

              // Convert the authService User to our domain User
              setUser({
                ...userData,
                id: String(userData.id), // Convert number id to string
                permissions: permissions, // Ensure permissions is set
              } as User);
            } else {
              console.log('User data not returned during initialization');
              setUser(null);
              tokenService.clearToken();
            }
          } catch (userError) {
            console.error('Failed to fetch user data during initialization:', userError);
            // If we can't fetch the user data, clear the token
            tokenService.clearToken();
            setUser(null);
          }
        } else {
          console.log('No valid token found during initialization');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
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
    console.log("Login process started");
    try {
      // Make sure CSRF token is initialized first
      await tokenService.initCsrfToken();

      const response = await authService.login({
        email,
        password,
        remember: rememberMe
      });

      // Ensure we have user data and token
      if (response && response.user && response.token) {
        console.log("Login response successful:", {
          hasToken: !!response.token,
          hasUser: !!response.user,
          userId: response.user.id,
          roles: response.user.roles?.map(r => typeof r === 'object' ? r.name : r).join(', ') || 'none'
        });

        // Make sure token is stored before updating user state
        tokenService.setToken(response.token);

        // Ensure permissions is always an array
        const permissions = Array.isArray(response.user.permissions)
          ? response.user.permissions
          : [];

        console.log("User permissions after login:", permissions);

        // Convert the response to our domain User type
        setUser({
          ...response.user,
          id: String(response.user.id),
          permissions: permissions,
        } as User);

        // Return success
        return true;
      } else {
        console.error('Invalid login response structure:', response);
        return false;
      }
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

    // Special case: 'super-admin' role users always pass role checks
    const userRoles = Array.isArray(user.roles)
      ? user.roles.map(r => typeof r === 'object' && r.name ? r.name : r)
      : [];

    if (userRoles.includes('super-admin')) return true;

    // Check against single or multiple roles
    const requiredRoles = Array.isArray(role) ? role : [role];
    return requiredRoles.some(r => userRoles.includes(r));
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;

    // Special case: 'super-admin' role users always have all permissions
    if (user.roles && Array.isArray(user.roles)) {
      const isAdmin = user.roles.some(role => {
        const roleName = typeof role === 'object' && role.name ? role.name : role;
        return roleName === 'super-admin';
      });

      if (isAdmin) return true;
    }

    // Regular permission check using the permissions array from the backend
    const userPermissions = Array.isArray(user.permissions)
      ? user.permissions
      : [];

    // Check against single or multiple permissions
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    return requiredPermissions.some(p => userPermissions.includes(p));
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
