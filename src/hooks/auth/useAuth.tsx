
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

  // Helper function to create a mock admin user
  const createMockAdminUser = (): User => {
    // Get all permissions from our constants
    const allPermissions = [
      // User Management permissions
      'view_users', 'create_users', 'edit_users', 'delete_users', 'assign_roles',
      // Legacy permissions
      'view users', 'create users', 'edit users', 'delete users', 'manage users',
      // Role permissions
      'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
      'view roles', 'create roles', 'edit roles', 'delete roles', 'manage roles',
      // Permission management
      'view_permissions', 'manage_permissions',
      'view permissions', 'manage permissions',
      // Activity log
      'view_activity_log', 'view activity log',
      // Settings
      'view_settings', 'edit_settings',
      'view settings', 'edit settings',
      // AI Configuration
      'manage_models', 'edit_prompts', 'test_ai', 'view_ai_logs',
      // Widget Builder
      'create_widgets', 'edit_widgets', 'publish_widgets', 'delete_widgets',
      // Knowledge Base
      'create_kb_articles', 'edit_kb_articles', 'delete_kb_articles', 'manage_kb_categories',
      // System Settings
      'manage_api_keys', 'billing_subscription', 'system_backup', 'view_audit_logs',
      // Special admin access
      'access admin panel'
    ];

    // Create a proper User object with Role objects that match the expected type
    const user: User = {
      id: 'admin-mock-1',
      name: 'Admin User',
      email: 'admin@example.com',
      status: 'active',
      roles: [{ 
        id: 'role-1', 
        name: 'admin',
        description: 'Administrator',
        permissions: allPermissions
      }],
      permissions: allPermissions,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    return user;
  };

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
      if (tokenService.validateToken()) {
        console.log('Refreshing authentication state...');
        const userData = await authService.getCurrentUser();
        
        if (userData) {
          // Convert the authService User to our domain User
          setUser({
            ...userData,
            id: String(userData.id), // Convert number id to string
            // Ensure the roles array is properly formatted to match the Role type
            roles: userData.roles ? userData.roles.map(role => ({
              id: String(role.id),
              name: role.name,
              description: role.description || '',
              permissions: role.permissions || []
            })) : []
          } as User);
          console.log('Authentication refreshed successfully:', userData);
        }
      } else {
        console.log('No valid token found during refresh');
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
      try {
        await tokenService.initCsrfToken(); // Make sure CSRF token is initialized first
        
        if (tokenService.validateToken()) {
          console.log('Token is valid, fetching user data...');
          try {
            const userData = await authService.getCurrentUser();
            console.log('User data fetched successfully:', userData);
            
            if (userData) {
              // Convert the authService User to our domain User
              setUser({
                ...userData,
                id: String(userData.id), // Convert number id to string
                // Ensure the roles array is properly formatted to match the Role type
                roles: userData.roles ? userData.roles.map(role => ({
                  id: String(role.id),
                  name: role.name,
                  description: role.description || '',
                  permissions: role.permissions || []
                })) : []
              } as User);
            }
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
      // Mock admin credentials check
      if (email === 'admin@example.com' && password === 'password') {
        console.log('Using mock admin credentials');
        // Create a mock admin user with all permissions
        const mockAdminUser = createMockAdminUser();
        
        // Set the mock admin user
        setUser(mockAdminUser);
        
        // Set a mock token to simulate login
        tokenService.setToken('mock-admin-token');
        
        setIsLoading(false);
        return true;
      }
      
      // Regular login flow for non-admin users
      // Make sure CSRF token is initialized first
      await tokenService.initCsrfToken();
      
      const response = await authService.login({
        email,
        password,
        remember: rememberMe
      });

      if (response && response.user) {
        // Convert the response to our domain User type
        setUser({
          ...response.user,
          id: String(response.user.id),
          // Ensure the roles array is properly formatted to match the Role type
          roles: response.user.roles ? response.user.roles.map(role => ({
            id: String(role.id),
            name: role.name,
            description: role.description || '',
            permissions: role.permissions || []
          })) : []
        } as User);
      }

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
      
      const response = await authService.register(data);

      if (response && response.user) {
        // Convert the response to our domain User type
        setUser({
          ...response.user,
          id: String(response.user.id), // Convert number id to string
          // Ensure the roles array is properly formatted to match the Role type
          roles: response.user.roles ? response.user.roles.map(role => ({
            id: String(role.id),
            name: role.name,
            description: role.description || '',
            permissions: role.permissions || []
          })) : []
        } as User);
      }

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
