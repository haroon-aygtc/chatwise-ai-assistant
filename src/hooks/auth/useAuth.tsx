import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "@/types/user";
import { Role } from "@/types";
import authService, { tokenService } from "@/services/auth";
import { SignupData } from "@/services/auth/types";
import { useToast } from "@/components/ui/use-toast";

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<boolean>;
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

  // Define login function with proper error handling
  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe?: boolean,
    ): Promise<boolean> => {
      setIsLoading(true);
      try {
        const { user: userData } = await authService.login({
          email,
          password,
          remember: !!rememberMe,
        });

        if (!userData) {
          throw new Error("Login successful but no user data returned");
        }

        // Set session marker to help with page refreshes
        sessionStorage.setItem("has_active_session", "true");

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
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Define logout function with useCallback to avoid dependency issues
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Still clear session markers even if logout API fails
      tokenService.removeToken();
      localStorage.removeItem("cached_user_data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Define signup function with proper error handling
  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await authService.register(data);

      if (!userData) {
        throw new Error("Signup successful but no user data returned");
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
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to refresh authentication status
  const refreshAuth = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Check if token exists
      const token = tokenService.getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Initialize CSRF token
      await tokenService.initCsrfToken();

      // Fetch user data
      const userData = await authService.getCurrentUser();

      if (userData) {
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
      } else {
        setUser(null);
        tokenService.removeToken();
      }
    } catch (error) {
      setUser(null);
      tokenService.removeToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Try to get token
        const token = tokenService.getToken();
        const hasActiveSession =
          sessionStorage.getItem("has_active_session") === "true";

        // If we have a token, try to get user data
        if (token && hasActiveSession) {
          // Initialize CSRF token
          await tokenService.initCsrfToken();

          // Fetch user data
          const userData = await authService.getCurrentUser();

          if (userData) {
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
          } else {
            setUser(null);
            tokenService.removeToken();
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        tokenService.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Simple session validity check
  useEffect(() => {
    // Only check if user is logged in
    if (!user) return;

    // Set up a simple session check interval
    const sessionCheckInterval = setInterval(() => {
      authService.checkSession().catch(() => {
        // If session check fails, logout
        logout();
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });
      });
    }, 60000); // Check once per minute

    // Handle auth expired event
    const handleAuthExpired = () => {
      if (user) {
        // Force immediate logout
        tokenService.removeToken();
        localStorage.removeItem("cached_user_data");
        setUser(null);

        // Show toast notification
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });

        // Redirect to login page
        window.location.href = "/login?session=expired";
      }
    };

    // Handle permission denied events
    const handlePermissionDenied = (event: CustomEvent) => {
      if (user) {
        toast({
          title: "Permission denied",
          description:
            event.detail?.message ||
            "You don't have permission to perform this action",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    // Add event listeners
    window.addEventListener("auth:expired", handleAuthExpired as EventListener);
    window.addEventListener(
      "permission:denied",
      handlePermissionDenied as EventListener,
    );

    // Clean up event listeners
    return () => {
      clearInterval(sessionCheckInterval);
      window.removeEventListener(
        "auth:expired",
        handleAuthExpired as EventListener,
      );
      window.removeEventListener(
        "permission:denied",
        handlePermissionDenied as EventListener,
      );
    };
  }, [user, logout, toast]);

  // Check if user has a specific role
  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!user || !user.roles) return false;

      // Convert role parameter to array if it's a single string
      const rolesToCheck = Array.isArray(role) ? role : [role];

      // Check if user has any of the specified roles
      return rolesToCheck.some((r) => {
        // Handle the case where user.roles could be an array or an object
        if (Array.isArray(user.roles)) {
          return user.roles.some(
            (ur) =>
              // If the user role is a string, direct comparison
              (typeof ur === "string" && ur === r) ||
              // If the user role is an object, check the name property
              (typeof ur === "object" && ur && "name" in ur && ur.name === r),
          );
        } else if (typeof user.roles === "object" && user.roles !== null) {
          // If roles is an object with role names as keys
          return r in user.roles;
        }
        return false;
      });
    },
    [user],
  );

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permission: string | string[]): boolean => {
      if (!user || !user.permissions) return false;

      // Permission aliases for more intuitive frontend permission checks
      const permissionAliases: Record<string, string[]> = {
        "access admin panel": ["view_users", "manage_users", "view_roles"],
        "manage users": [
          "view_users",
          "create_users",
          "edit_users",
          "delete_users",
          "manage_users",
        ],
        "manage roles": [
          "view_roles",
          "create_roles",
          "edit_roles",
          "delete_roles",
          "manage_roles",
        ],
        "manage widgets": [
          "create_widgets",
          "edit_widgets",
          "publish_widgets",
          "delete_widgets",
        ],
        "manage kb": [
          "create_kb_articles",
          "edit_kb_articles",
          "delete_kb_articles",
          "manage_kb_categories",
        ],
        "manage ai": [
          "manage_models",
          "edit_prompts",
          "test_ai",
          "view_ai_logs",
        ],
      };

      // Regular permission check using the permissions array from the backend
      const userPermissions = Array.isArray(user.permissions)
        ? user.permissions
        : [];

      // Check against single or multiple permissions
      const requiredPermissions = Array.isArray(permission)
        ? permission
        : [permission];

      // For each required permission, check if user has it directly or via an alias
      return requiredPermissions.some((p) => {
        // Direct permission check
        if (userPermissions.includes(p)) return true;

        // Check via aliases (if this permission has aliases defined)
        const aliases = permissionAliases[p];
        if (
          aliases &&
          aliases.some((alias) => userPermissions.includes(alias))
        ) {
          return true;
        }

        // Check for permission with different format (with/without underscores)
        const normalizedPermission = p.replace(/[ _]/g, "_");
        const spacedPermission = p.replace(/[ _]/g, " ");

        return (
          userPermissions.includes(normalizedPermission) ||
          userPermissions.includes(spacedPermission)
        );
      });
    },
    [user],
  );

  // Update user data
  const updateUser = useCallback((userData: Partial<User>): void => {
    setUser((prevUser) => {
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
