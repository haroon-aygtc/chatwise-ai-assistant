import { useEffect } from "react";
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
import SettingsPageWrapper from "@/pages/admin/SettingsPageWrapper";
import KnowledgeBasePage from "@/pages/admin/KnowledgeBasePage";
import AIConfigurationPage from "@/pages/admin/AIConfigurationPage";
import { AIModelManager } from "@/components/admin/ai-configuration/AIModelManager";
import { ResponseFormatterManager } from "@/components/admin/ai-configuration/response-formats";
import { FollowUpManager } from "@/components/admin/ai-configuration/FollowUpManager";
import { RedirectComponent } from "@/components/admin/ai-configuration/RedirectComponent";
import { useAuth } from "@/hooks/auth/useAuth";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
// No need to import tempo routes, they're handled by the plugin

// Debug flag
const DEBUG = import.meta.env.DEV;

// Error boundary component to catch React errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
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
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-700">
            An error occurred in the application. Please try refreshing the
            page.
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
const AISettingsManager = () => (
  <RedirectComponent componentName="AI Settings" />
);
const BranchingFlowsManager = () => (
  <RedirectComponent componentName="Branching Flows" />
);

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
  const { isAuthenticated, refreshAuth } = useAuth();

  // Set page load time and handle visibility changes
  useEffect(() => {
    // Track page load state to prevent immediate redirects
    const isFirstLoad = !sessionStorage.getItem("app_initialized");

    // Always update page load time for refresh detection
    sessionStorage.setItem("page_load_time", Date.now().toString());

    // Check if we have an active session
    const hasActiveSession =
      sessionStorage.getItem("has_active_session") === "true";

    // If authenticated, ensure the session is marked as active
    if (isAuthenticated) {
      sessionStorage.setItem("has_active_session", "true");
    }

    // If this is a page refresh with an active session, preserve it
    if (document.readyState !== "complete" && hasActiveSession) {
      if (DEBUG) console.log("App: Detected page refresh with active session");

      // Ensure the session is marked as active
      sessionStorage.setItem("has_active_session", "true");

      // Add a flag to prevent immediate auth redirects with longer timeout
      sessionStorage.setItem("prevent_auth_redirect", "true");

      // Remove the prevention after a longer delay
      setTimeout(() => {
        sessionStorage.removeItem("prevent_auth_redirect");
      }, 15000); // Increased to 15 seconds

      // Refresh auth to ensure we have the latest user data
      refreshAuth().catch((err) => {
        console.warn("Failed to refresh auth during page load:", err);
      });
    }

    if (isFirstLoad) {
      // Mark that app is initialized to track first page load
      sessionStorage.setItem("app_initialized", "true");

      // Add a flag to prevent immediate auth redirects
      sessionStorage.setItem("prevent_auth_redirect", "true");

      // Remove the prevention after a delay
      setTimeout(() => {
        sessionStorage.removeItem("prevent_auth_redirect");
      }, 10000);
    }

    // Listen for page visibility changes to detect tab switches
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Update page load time when tab becomes visible again
        sessionStorage.setItem("page_load_time", Date.now().toString());

        // If we have an active session, refresh auth when returning to the tab
        if (sessionStorage.getItem("has_active_session") === "true") {
          refreshAuth().catch((err) => {
            console.warn("Failed to refresh auth on visibility change:", err);
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, refreshAuth]);

  // Listen for auth expired events
  const handleAuthExpired = () => {
    console.log("App: Received auth:expired event");
    // Use React Router's navigate if available
    window.location.href = "/login?session=expired";
  };

  // Listen for custom navigation events
  const handleAppNavigate = (event: CustomEvent) => {
    if (event.detail && event.detail.to) {
      console.log(`App: Navigating to ${event.detail.to}`);
      window.location.href = event.detail.to;
      return true; // Mark as handled
    }
    return false;
  };

  useEffect(() => {
    // Add event listeners
    window.addEventListener("auth:expired", handleAuthExpired as EventListener);
    window.addEventListener("app:navigate", handleAppNavigate as EventListener);

    // Clean up event listeners
    return () => {
      window.removeEventListener(
        "auth:expired",
        handleAuthExpired as EventListener,
      );
      window.removeEventListener(
        "app:navigate",
        handleAppNavigate as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    // Initialize app without additional API calls
    if (DEBUG) console.log("App component initializing...");
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <ErrorBoundary
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="p-6 max-w-md bg-white rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 text-red-600">
                    Authentication Error
                  </h2>
                  <p className="mb-4">
                    There was a problem with the authentication system. Please
                    try refreshing the page.
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
            {/* Tempo routes are handled by the tempo plugin */}

            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
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
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboardContent />}
                />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route
                  path="/admin/ai-configuration"
                  element={<AIConfigurationPage />}
                >
                  <Route path="models" element={<AIModelManager />} />
                  <Route
                    path="response-formats"
                    element={<ResponseFormatterManager />}
                  />
                  <Route path="follow-up" element={<FollowUpManager />} />
                  <Route
                    path="branching-flows"
                    element={<BranchingFlowsManager />}
                  />
                  <Route path="settings" element={<AISettingsManager />} />
                  <Route
                    path="*"
                    element={
                      <RedirectComponent componentName="Requested AI Component" />
                    }
                  />
                </Route>
                <Route
                  path="/admin/knowledge-base"
                  element={<KnowledgeBasePage />}
                />
                <Route
                  path="/admin/widget-builder"
                  element={<WidgetBuilderPage />}
                />
                <Route
                  path="/admin/settings"
                  element={<SettingsPageWrapper />}
                />
              </Route>

              {/* Error pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
