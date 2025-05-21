/**
 * Auth Hook
 *
 * Provides authentication state and methods for components
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/core/auth/authService";
import { LoginCredentials, RegisterData } from "@/core/auth/types";

/**
 * User data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

/**
 * Auth hook result
 */
export interface AuthHookResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

/**
 * Auth hook for managing authentication state
 */
export function useAuth(): AuthHookResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Derived state
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user],
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user || !user.roles) return false;
      return user.roles.includes(role);
    },
    [user],
  );

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setIsLoading(true);
      try {
        await authService.login(credentials);
        const userData = await authService.getCurrentUser();

        if (!userData) {
          throw new Error("Login succeeded but failed to get user data");
        }

        setUser(userData);
        toast.success("Login successful");
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed. Please check your credentials.");
        setUser(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  /**
   * Logout handler
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  /**
   * Register handler
   */
  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      setIsLoading(true);
      try {
        await authService.register(data);
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  /**
   * Check authentication on mount and set up session expiration listener
   */
  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Set up listener for session expiration
    const handleSessionExpired = () => {
      setUser(null);
      toast.error("Your session has expired. Please log in again.");
      navigate("/login");
    };

    window.addEventListener("auth:expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:expired", handleSessionExpired);
    };
  }, [checkAuth, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    checkAuth,
    hasPermission,
    hasRole,
  };
}
