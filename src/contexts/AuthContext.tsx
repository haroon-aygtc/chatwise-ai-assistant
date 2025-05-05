
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AuthService, { UserResponse } from '../services/auth/authService';
import { tokenService } from '../services/auth/tokenService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  updateUser: (userData: Partial<UserResponse>) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Function to refresh authentication status
  const refreshAuth = async (): Promise<void> => {
    try {
      if (tokenService.validateToken()) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
      setIsAuthenticated(false);
      tokenService.clearToken();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if there's a valid token
        if (tokenService.validateToken()) {
          try {
            // Fetch current user
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error fetching user data:', error);
            tokenService.clearToken();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    // Set up token expiry check interval
    const tokenCheckInterval = setInterval(() => {
      // If token is expired, trigger a logout
      if (isAuthenticated && tokenService.isTokenExpired()) {
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
  }, [isAuthenticated]);

  const login = async (email: string, password: string, remember: boolean): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password, remember });
      setUser(response.user);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
        duration: 3000,
      });
    } catch (error: any) {
      const message = error.message || 'Failed to login. Please check your credentials.';
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AuthService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setUser(response.user);
      setIsAuthenticated(true);
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
        duration: 3000,
      });
    } catch (error: any) {
      const message = error.message || 'Registration failed. Please try again.';
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      tokenService.clearToken();
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
        duration: 3000,
      });
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false;

    if (Array.isArray(role)) {
      return role.some(r => user.roles.includes(r));
    }
    
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;

    if (Array.isArray(permission)) {
      return permission.some(p => user.permissions.includes(p));
    }
    
    return user.permissions.includes(permission);
  };

  const updateUser = (userData: Partial<UserResponse>): void => {
    if (user) {
      setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    updateUser,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
