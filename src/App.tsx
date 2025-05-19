import { useState, useEffect } from "react";
import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/auth/useAuth";
import SessionExpirationModal from "@/components/auth/SessionExpirationModal";

// Layout components
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import AuthLayout from "@/modules/auth/components/AuthLayout";
import AdminLayout from "@/components/admin/AdminLayout";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Main pages
import HomePage from "@/pages/HomePage";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import ComponentShowcasePage from "@/pages/ComponentShowcasePage";

// Admin pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import AIConfigurationPage from "@/pages/admin/AIConfigurationPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import WidgetBuilderPage from "@/pages/admin/WidgetBuilderPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import ChatSessionsPage from "@/pages/admin/ChatSessionsPage";
import KnowledgeBasePage from "@/pages/admin/KnowledgeBasePage";
import ApiTester from "./components/api-tester/ApiTester";

// Debug flag
const DEBUG = true;

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

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

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
            <AuthProvider>
              {isInitialized ? (
                <>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/components" element={<ComponentShowcasePage />} />

                    {/* Auth routes - Use the page components directly which internally use AuthLayout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="api-tester" element={<ApiTester />} />

                    {/* Protected routes */}
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute>
                          <HomePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute
                          requiredRole="admin"
                          requiredPermission="access admin panel"
                        >
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/admin/dashboard" />} />
                      <Route path="dashboard" element={<AdminDashboardPage />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="users" element={<UserManagementPage />} />
                      <Route path="ai-config" element={<AIConfigurationPage />} />
                      <Route path="knowledge-base" element={<KnowledgeBasePage />} />
                      <Route path="widget-builder" element={<WidgetBuilderPage />} />
                      <Route path="chat-sessions" element={<ChatSessionsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>

                    {/* Error pages */}
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster position="top-right" />
                  <ErrorBoundary>
                    <SessionExpirationModal />
                  </ErrorBoundary>
                </>
              ) : (
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
