import { useState, useEffect } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layouts/MainLayout";
import DashboardContent from "@/pages/DashboardContent";
import LandingPage from "@/pages/LandingPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import ChatSessionsPage from "@/pages/ChatSessionsPage";
import AdminDashboardContent from "@/pages/admin/AdminDashboardContent";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import WidgetBuilderPage from "@/pages/admin/WidgetBuilderPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import KnowledgeBasePage from "@/pages/admin/KnowledgeBasePage";
import ApiTester from "./components/api-tester/ApiTester";
import { ConfigurationManager } from "@/components/admin/ai-configuration/ConfigurationManager";
import { AIModelManager } from "@/components/admin/ai-configuration/AIModelManager";
import { ResponseFormatterManager } from "@/components/admin/ai-configuration/response-formats";
import { FollowUpManager } from "@/components/admin/ai-configuration/FollowUpManager";
import { RedirectComponent } from "@/components/admin/ai-configuration/RedirectComponent";
import { useAuth } from "@/hooks/auth/useAuth";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";

// Debug flag
const DEBUG = import.meta.env.DEV;

// Error boundary component to catch React errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-5">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="mb-4 text-gray-700">
            An error occurred in the application. Please try refreshing the page.
          </p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Create placeholders using RedirectComponent for unimplemented features
const AISettingsManager = () => <RedirectComponent componentName="AI Settings" />;
const BranchingFlowsManager = () => <RedirectComponent componentName="Branching Flows" />;

// Simple component for Not Found pages
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-6">The page you are looking for does not exist.</p>
    <button
      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"
      onClick={() => window.history.back()}
    >
      Go Back
    </button>
  </div>
);

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Prefetch CSRF token only when needed and avoid excessive API calls
    const initializeApp = async () => {
      try {
        // Only initialize app without additional API calls
        if (DEBUG) console.log("App component initializing...");
        setIsInitialized(true);
      } catch (error) {
        console.error("App initialization error:", error);
        // Still set as initialized to avoid blocking the UI
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Helper component to protect routes
  const ProtectedRoute = ({ children, requiredRole, requiredPermission }: {
    children: React.ReactNode;
    requiredRole?: string;
    requiredPermission?: string | string[];
  }) => {
    const { user, hasRole, hasPermission } = useAuth();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <ErrorBoundary
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="p-6 max-w-md bg-white rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
                  <p className="mb-4">
                    There was a problem with the authentication system. Please try refreshing the page.
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            }
          >
            {isInitialized ? (
              <>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/api-tester" element={<ApiTester />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<SignupPage />} />

                  {/* Protected routes using MainLayout */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Regular user routes */}
                    <Route path="/home" element={<DashboardContent />} />
                    <Route path="/dashboard" element={<DashboardContent />} />
                    <Route path="/chat-sessions" element={<ChatSessionsPage />} />

                    {/* Admin routes */}
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboardContent />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <ProtectedRoute requiredRole="admin">
                        <AnalyticsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute
                        requiredRole="admin"
                        requiredPermission={["view_users", "view_roles", "manage_users"]}
                      >
                        <UserManagementPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/ai-configuration" element={
                      <ProtectedRoute requiredRole="admin">
                        <ConfigurationManager />
                      </ProtectedRoute>
                    }>
                      <Route path="models" element={<AIModelManager />} />
                      <Route path="response-formats" element={<ResponseFormatterManager />} />
                      <Route path="follow-up" element={<FollowUpManager />} />
                      <Route path="branching-flows" element={<BranchingFlowsManager />} />
                      <Route path="settings" element={<AISettingsManager />} />
                      <Route path="*" element={<RedirectComponent componentName="Requested AI Component" />} />
                    </Route>
                    <Route path="/admin/knowledge-base" element={
                      <ProtectedRoute requiredRole="admin">
                        <KnowledgeBasePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/widget-builder" element={
                      <ProtectedRoute requiredRole="admin">
                        <WidgetBuilderPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* Error pages */}
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </>
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
