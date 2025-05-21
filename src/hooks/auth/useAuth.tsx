import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
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

  // Track ongoing refresh to prevent multiple simultaneous attempts
  const refreshInProgress = useRef<boolean>(false);

  // Track last refresh time to prevent excessive refreshes
  const lastRefreshTime = useRef<number>(0);
  const MIN_REFRESH_INTERVAL = 2000; // 2 seconds minimum between refreshes

  // Define login function with proper error handling
  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe?: boolean,
    ): Promise<boolean> => {
      setIsLoading(true);
      try {
        // First ensure CSRF token is initialized
        await tokenService.initCsrfToken();

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

        // Store the current time as last login time
        localStorage.setItem("last_login_time", Date.now().toString());

        // Cache user data for refresh scenarios
        localStorage.setItem("cached_user_data", JSON.stringify(userData));

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

      // Clear session marker
      sessionStorage.removeItem("has_active_session");

      // Clear other session-related data
      localStorage.removeItem("last_login_time");
      localStorage.removeItem("last_active_time");
      localStorage.removeItem("cached_user_data");
    } catch (error) {
      // Still clear session markers even if logout API fails
      sessionStorage.removeItem("has_active_session");
      localStorage.removeItem("cached_user_data");
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

      const { user: userData } = await authService.register(data);

      if (!userData) {
        throw new Error("Signup successful but no user data returned");
      }

      // Cache user data for refresh scenarios
      localStorage.setItem("cached_user_data", JSON.stringify(userData));

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

  // Function to refresh authentication status with rate limiting
  const refreshAuth = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous refresh attempts
    if (refreshInProgress.current) {
      return;
    }

    // Rate limit refreshes
    const now = Date.now();
    if (now - lastRefreshTime.current < MIN_REFRESH_INTERVAL) {
      console.log("Auth refresh rate limited, skipping");
      return;
    }

    lastRefreshTime.current = now;
    refreshInProgress.current = true;
    setIsLoading(true);

    try {
      // Check if token exists and is valid
      const token = tokenService.getToken();
      const isValid = tokenService.validateToken();

      // Check if this is a page refresh scenario
      const isPageReload = document.readyState !== "complete";
      const pageLoadTime = Number(
        sessionStorage.getItem("page_load_time") || "0",
      );
      const isRecentPageLoad = Date.now() - pageLoadTime < 5000;
      const isRefreshScenario = isPageReload || isRecentPageLoad;
      const hasActiveSession =
        sessionStorage.getItem("has_active_session") === "true";

      if (isValid || (isRefreshScenario && hasActiveSession && token)) {
        // Initialize CSRF token first (for Sanctum protection)
        try {
          await tokenService.initCsrfToken();
        } catch (csrfError) {
          // Continue anyway - this shouldn't prevent authentication check
        }

        try {
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

            // Cache user data for refresh scenarios
            localStorage.setItem("cached_user_data", JSON.stringify(userData));

            // Set session marker to help with page refreshes
            sessionStorage.setItem("has_active_session", "true");

            // Update last active time
            localStorage.setItem("last_active_time", Date.now().toString());
          } else if (isRefreshScenario && hasActiveSession) {
            // During page refresh, try to use cached user data
            const cachedUser = JSON.parse(
              localStorage.getItem("cached_user_data") || "null",
            );
            if (cachedUser) {
              console.log("Using cached user data during refresh");
              setUser({
                ...cachedUser,
                id: String(cachedUser.id),
                permissions: Array.isArray(cachedUser.permissions)
                  ? cachedUser.permissions
                  : [],
              } as User);
              return;
            }

            // If no cached data, use temporary user
            setUser({
              id: "temp-user",
              name: "Loading...",
              email: "",
              permissions: [],
              roles: [],
            } as User);
          } else {
            setUser(null);
            tokenService.clearToken();
            sessionStorage.removeItem("has_active_session");
          }
        } catch (error) {
          // During page refresh, try to use cached user data
          if (isRefreshScenario && hasActiveSession) {
            const cachedUser = JSON.parse(
              localStorage.getItem("cached_user_data") || "null",
            );
            if (cachedUser) {
              console.log("API error during refresh, using cached user data");
              setUser({
                ...cachedUser,
                id: String(cachedUser.id),
                permissions: Array.isArray(cachedUser.permissions)
                  ? cachedUser.permissions
                  : [],
              } as User);
              return;
            }

            // If no cached data, use temporary user
            setUser({
              id: "temp-user",
              name: "Loading...",
              email: "",
              permissions: [],
              roles: [],
            } as User);
          } else {
            setUser(null);
            tokenService.clearToken();
            sessionStorage.removeItem("has_active_session");
          }
        }
      } else if (isRefreshScenario && hasActiveSession && token) {
        // During page refresh with invalid token but active session, try to use cached data
        const cachedUser = JSON.parse(
          localStorage.getItem("cached_user_data") || "null",
        );
        if (cachedUser) {
          console.log("Invalid token during refresh, using cached user data");
          setUser({
            ...cachedUser,
            id: String(cachedUser.id),
            permissions: Array.isArray(cachedUser.permissions)
              ? cachedUser.permissions
              : [],
          } as User);
        } else {
          setUser(null);
          tokenService.clearToken();
          sessionStorage.removeItem("has_active_session");
        }
      } else {
        setUser(null);
        tokenService.clearToken();
        sessionStorage.removeItem("has_active_session");
      }
    } catch (error) {
      // Check if this is a page refresh scenario
      const isPageReload = document.readyState !== "complete";
      const pageLoadTime = Number(
        sessionStorage.getItem("page_load_time") || "0",
      );
      const isRecentPageLoad = Date.now() - pageLoadTime < 5000;
      const isRefreshScenario = isPageReload || isRecentPageLoad;
      const hasActiveSession =
        sessionStorage.getItem("has_active_session") === "true";
      const token = tokenService.getToken();

      if (isRefreshScenario && hasActiveSession && token) {
        // During page refresh with error, try to use cached user data
        const cachedUser = JSON.parse(
          localStorage.getItem("cached_user_data") || "null",
        );
        if (cachedUser) {
          console.log("Error during refresh, using cached user data");
          setUser({
            ...cachedUser,
            id: String(cachedUser.id),
            permissions: Array.isArray(cachedUser.permissions)
              ? cachedUser.permissions
              : [],
          } as User);
        } else {
          // If no cached data, use temporary user
          setUser({
            id: "temp-user",
            name: "Loading...",
            email: "",
            permissions: [],
            roles: [],
          } as User);
        }
      } else {
        setUser(null);
        tokenService.clearToken();
        sessionStorage.removeItem("has_active_session");
      }
    } finally {
      setIsLoading(false);
      refreshInProgress.current = false;
    }
  }, []);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    // Set page load time in sessionStorage
    sessionStorage.setItem("page_load_time", Date.now().toString());

    // Set a flag to indicate this is a page load/refresh with a longer timeout
    sessionStorage.setItem("prevent_auth_redirect", "true");

    // Clear the flag after a longer delay
    setTimeout(() => {
      sessionStorage.removeItem("prevent_auth_redirect");
    }, 10000); // Increased from 5000ms to 10000ms for initial auth to complete

    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Improved page reload detection
        const isPageReload = document.readyState !== "complete";
        const pageLoadTime = Number(
          sessionStorage.getItem("page_load_time") || "0",
        );
        const isRecentPageLoad = Date.now() - pageLoadTime < 5000; // Increased from 3000ms to 5000ms
        const isRefreshScenario = isPageReload || isRecentPageLoad;

        // Check for session storage marker first (helps with page refreshes)
        const hasActiveSession =
          sessionStorage.getItem("has_active_session") === "true";

        // Try to get token and check validity
        const token = tokenService.getToken();

        // During page load with active session, be more lenient
        // This prevents brief flashes of login page during refresh
        if ((isRefreshScenario || hasActiveSession) && token) {
          console.log("Auth: Page refresh or active session detected");

          // Set a temporary user immediately to prevent login flashes
          if (isRefreshScenario && hasActiveSession) {
            // Try to use cached user data first
            const cachedUser = JSON.parse(
              localStorage.getItem("cached_user_data") || "null",
            );
            if (cachedUser) {
              console.log("Using cached user data during initial load");
              setUser({
                ...cachedUser,
                id: String(cachedUser.id),
                permissions: Array.isArray(cachedUser.permissions)
                  ? cachedUser.permissions
                  : [],
              } as User);
            } else {
              setUser({
                id: "temp-user",
                name: "Loading...",
                email: "",
                permissions: [],
                roles: [],
              } as User);
            }
          }

          try {
            // Use a shorter timeout for the initial auth check during refresh
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

              // Cache user data for refresh scenarios
              localStorage.setItem(
                "cached_user_data",
                JSON.stringify(userData),
              );

              // Update the session marker
              sessionStorage.setItem("has_active_session", "true");

              setIsLoading(false);
              return;
            }
          } catch (loadError) {
            console.warn("Auth: Initial user data fetch failed:", loadError);

            // If we're in a refresh scenario with active session, don't immediately log out
            // This prevents jarring redirects during page refresh
            if (isRefreshScenario && hasActiveSession) {
              console.log(
                "Auth: Preserving session during refresh despite error",
              );

              // Try to use cached user data
              const cachedUser = JSON.parse(
                localStorage.getItem("cached_user_data") || "null",
              );
              if (cachedUser) {
                console.log("Using cached user data after API error");
                setUser({
                  ...cachedUser,
                  id: String(cachedUser.id),
                  permissions: Array.isArray(cachedUser.permissions)
                    ? cachedUser.permissions
                    : [],
                } as User);

                setIsLoading(false);
                return;
              }

              // Keep the temporary user to prevent redirect
              if (!user) {
                setUser({
                  id: "temp-user",
                  name: "Loading...",
                  email: "",
                  permissions: [],
                  roles: [],
                } as User);
              }

              // Schedule multiple retry attempts with exponential backoff
              const retryAuth = (attempt = 1, maxAttempts = 3) => {
                if (attempt > maxAttempts) {
                  console.log(`Auth: All ${maxAttempts} retry attempts failed`);
                  return;
                }

                const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
                console.log(
                  `Auth: Scheduling retry attempt ${attempt}/${maxAttempts} after ${delay}ms`,
                );

                setTimeout(() => {
                  console.log(
                    `Auth: Executing retry attempt ${attempt}/${maxAttempts}`,
                  );
                  refreshAuth().catch(() => {
                    retryAuth(attempt + 1, maxAttempts);
                  });
                }, delay);
              };

              // Start retry sequence
              retryAuth();

              setIsLoading(false);
              return;
            }

            // If we fail here during page load, don't clear session yet
            // We'll retry with full error handling below
            console.log("Initial auth check failed during page load");
          }
        }

        // Proceed with normal auth flow
        const isValid = token ? tokenService.validateToken() : false;

        // Only initialize CSRF and fetch user data if we have a valid token
        if (isValid) {
          // Initialize CSRF token first (for Sanctum protection)
          try {
            await tokenService.initCsrfToken();
          } catch (csrfError) {
            console.warn("Failed to initialize CSRF token:", csrfError);
            // Continue anyway - this shouldn't prevent authentication check
          }

          try {
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

              // Cache user data for refresh scenarios
              localStorage.setItem(
                "cached_user_data",
                JSON.stringify(userData),
              );

              // Mark that we have an active session
              sessionStorage.setItem("has_active_session", "true");
            } else {
              setUser(null);
              tokenService.clearToken();
            }
          } catch (userError) {
            console.warn("Failed to fetch user data:", userError);

            // If we have an active session marker, try multiple times with exponential backoff
            if (hasActiveSession && token) {
              // Try to use cached user data first
              const cachedUser = JSON.parse(
                localStorage.getItem("cached_user_data") || "null",
              );
              if (cachedUser) {
                console.log("Using cached user data after API error");
                setUser({
                  ...cachedUser,
                  id: String(cachedUser.id),
                  permissions: Array.isArray(cachedUser.permissions)
                    ? cachedUser.permissions
                    : [],
                } as User);

                setIsLoading(false);
                return;
              }

              let retryCount = 0;
              const maxRetries = 3;

              const attemptRetry = async () => {
                retryCount++;
                const delay = Math.pow(2, retryCount - 1) * 1000; // 1s, 2s, 4s

                console.log(
                  `Auth: Retry attempt ${retryCount}/${maxRetries} after ${delay}ms`,
                );

                setTimeout(async () => {
                  try {
                    const retryUserData = await authService.getCurrentUser();
                    if (retryUserData) {
                      // Ensure permissions is always an array
                      const permissions = Array.isArray(
                        retryUserData.permissions,
                      )
                        ? retryUserData.permissions
                        : [];

                      // Convert the authService User to our domain User
                      setUser({
                        ...retryUserData,
                        id: String(retryUserData.id), // Convert number id to string
                        permissions: permissions, // Ensure permissions is set
                      } as User);

                      // Cache user data for refresh scenarios
                      localStorage.setItem(
                        "cached_user_data",
                        JSON.stringify(retryUserData),
                      );

                      // Update session marker
                      sessionStorage.setItem("has_active_session", "true");

                      setIsLoading(false);
                      return;
                    }
                  } catch (retryError) {
                    console.warn(
                      `Auth: Retry attempt ${retryCount} failed:`,
                      retryError,
                    );

                    // Try again if we haven't reached max retries
                    if (retryCount < maxRetries) {
                      attemptRetry();
                      return;
                    }
                  }

                  // If all retries fail, clear token and set user to null
                  console.log(
                    "Auth: All retry attempts failed, clearing session",
                  );
                  tokenService.clearToken();
                  setUser(null);
                  setIsLoading(false);
                }, delay);
              };

              // Start the retry process
              attemptRetry();

              // Don't set isLoading to false yet, we'll do it in the retry process
              return;
            } else {
              // If we can't fetch the user data and don't have an active session marker, clear the token
              tokenService.clearToken();
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        tokenService.clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAuth]);

  // Add listener for storage events to detect token changes in other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth_token") {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAuth]);

  // Simple session validity check
  useEffect(() => {
    // Set up a simple session check interval
    const sessionCheckInterval = setInterval(() => {
      // Only check if user is logged in
      if (user) {
        // Simple ping to verify session is still valid
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
      }
    }, 60000); // Check once per minute

    // Listen for custom auth expiry event from API client
    const handleAuthExpired = () => {
      if (user) {
        // Force immediate logout
        tokenService.clearToken();
        sessionStorage.removeItem("has_active_session");
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
  }, [user, logout, toast, refreshAuth]);

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
      // This allows frontend code to use more intuitive permission names
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
        // This handles both "view users" and "view_users" format variations
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
