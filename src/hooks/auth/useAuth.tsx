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

  // Track ongoing refresh to prevent multiple simultaneous attempts
  const refreshInProgress = React.useRef<boolean>(false);

  // Define login function with proper error handling
  const login = useCallback(async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First ensure CSRF token is initialized
      await tokenService.initCsrfToken();

      const { user: userData } = await authService.login({ email, password, remember: !!rememberMe });

      if (!userData) {
        throw new Error('Login successful but no user data returned');
      }

      // Ensure permissions is always an array
      const permissions = Array.isArray(userData.permissions)
        ? userData.permissions
        : [];

      // Convert the authService User to our domain User
      setUser({
        ...userData,
        id: String(userData.id), // Convert number id to string
        permissions: permissions, // Ensure permissions is set
      } as User);

      // Successfully logged in
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  // Define signup function with proper error handling
  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First ensure CSRF token is initialized
      await tokenService.initCsrfToken();

      const { user: userData } = await authService.signup(data);

      if (!userData) {
        throw new Error('Signup successful but no user data returned');
      }

      // Ensure permissions is always an array
      const permissions = Array.isArray(userData.permissions)
        ? userData.permissions
        : [];

      // Convert the authService User to our domain User
      setUser({
        ...userData,
        id: String(userData.id), // Convert number id to string
        permissions: permissions, // Ensure permissions is set
      } as User);

      // Successfully signed up
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to refresh authentication status
  const refreshAuth = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous refresh attempts
    if (refreshInProgress.current) {
      console.log('Auth refresh already in progress, skipping');
      return;
    }

    refreshInProgress.current = true;
    setIsLoading(true);
    console.log('Starting auth refresh');

    try {
      // Check if token exists and is valid
      const token = tokenService.getToken();
      const isValid = tokenService.validateToken();

      console.log(`Token check: exists=${!!token}, valid=${isValid}`);

      if (isValid) {
        console.log('Token is valid, fetching user data...');

        // Initialize CSRF token first (for Sanctum protection)
        try {
          await tokenService.initCsrfToken();
          console.log('CSRF token initialized during refresh');
        } catch (csrfError) {
          console.warn('CSRF token initialization failed during refresh:', csrfError);
          // Continue anyway - this shouldn't prevent authentication check
        }

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
      refreshInProgress.current = false;
    }
  }, []);

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
  }, []);

  // Add listener for storage events to detect token changes in other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token') {
        console.log('Auth token changed in another tab, refreshing auth state');
        refreshAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshAuth]);

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

      // If token needs refresh, attempt to refresh it proactively
      if (user && tokenService.needsRefresh()) {
        console.log('Token approaching expiration, attempting refresh...');
        refreshAuth();
      }
    }, 60000); // Check every minute

    // Listen for custom auth expiry event from API client
    const handleAuthExpired = () => {
      console.log('Auth expired event received');
      if (user) {
        logout();
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    // Add event listener for custom auth expiry event
    window.addEventListener('auth:expired', handleAuthExpired as EventListener);

    // Also refresh auth on visibility change (when user returns to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        // Only refresh if we were away for more than 5 minutes
        const lastActiveTime = Number(localStorage.getItem('last_active_time') || '0');
        const now = Date.now();
        const awayTime = now - lastActiveTime;

        if (awayTime > 5 * 60 * 1000) { // 5 minutes in milliseconds
          console.log('Returning to tab after inactivity, refreshing auth');
          refreshAuth();
        }

        // Update last active time
        localStorage.setItem('last_active_time', now.toString());
      }
    };

    // Set initial last active time
    localStorage.setItem('last_active_time', Date.now().toString());

    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up intervals and event listeners
    return () => {
      clearInterval(tokenCheckInterval);
      window.removeEventListener('auth:expired', handleAuthExpired as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, logout, toast, refreshAuth]);

  // Check if user has a specific role
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    // Convert role parameter to array if it's a single string
    const rolesToCheck = Array.isArray(role) ? role : [role];

    // Check if user has any of the specified roles
    return rolesToCheck.some(r => {
      // Handle the case where user.roles could be an array or an object
      if (Array.isArray(user.roles)) {
        return user.roles.some(ur =>
          // If the user role is a string, direct comparison
          (typeof ur === 'string' && ur === r) ||
          // If the user role is an object, check the name property
          (typeof ur === 'object' && ur && 'name' in ur && ur.name === r)
        );
      } else if (typeof user.roles === 'object' && user.roles !== null) {
        // If roles is an object with role names as keys
        return r in user.roles;
      }
      return false;
    });
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;

    // Permission aliases for more intuitive frontend permission checks
    // This allows frontend code to use more intuitive permission names
    const permissionAliases: Record<string, string[]> = {
      'access admin panel': ['view_users', 'manage_users', 'view_roles'],
      'manage users': ['view_users', 'create_users', 'edit_users', 'delete_users', 'manage_users'],
      'manage roles': ['view_roles', 'create_roles', 'edit_roles', 'delete_roles', 'manage_roles'],
      'manage widgets': ['create_widgets', 'edit_widgets', 'publish_widgets', 'delete_widgets'],
      'manage kb': ['create_kb_articles', 'edit_kb_articles', 'delete_kb_articles', 'manage_kb_categories'],
      'manage ai': ['manage_models', 'edit_prompts', 'test_ai', 'view_ai_logs']
    };

    // Regular permission check using the permissions array from the backend
    const userPermissions = Array.isArray(user.permissions)
      ? user.permissions
      : [];

    // Check against single or multiple permissions
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    // For each required permission, check if user has it directly or via an alias
    return requiredPermissions.some(p => {
      // Direct permission check
      if (userPermissions.includes(p)) return true;

      // Check via aliases (if this permission has aliases defined)
      const aliases = permissionAliases[p];
      if (aliases && aliases.some(alias => userPermissions.includes(alias))) {
        return true;
      }

      // Check for permission with different format (with/without underscores)
      // This handles both "view users" and "view_users" format variations
      const normalizedPermission = p.replace(/[ _]/g, '_');
      const spacedPermission = p.replace(/[ _]/g, ' ');

      return userPermissions.includes(normalizedPermission) ||
        userPermissions.includes(spacedPermission);
    });
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

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
