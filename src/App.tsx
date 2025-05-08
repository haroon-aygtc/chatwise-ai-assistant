import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
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
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin" requiredPermission="access admin panel">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route
                path="ai-config"
                element={<AIConfigurationPage />}
              />
              <Route
                path="knowledge-base"
                element={<KnowledgeBasePage />}
              />
              <Route path="widget-builder" element={<WidgetBuilderPage />} />
              <Route path="chat-sessions" element={<ChatSessionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
          <SessionExpirationModal />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
