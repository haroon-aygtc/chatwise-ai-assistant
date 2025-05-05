
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLayout from "./components/admin/AdminLayout";
import AdminNotFound from "./components/admin/AdminNotFound";
import UnderDevelopment from "./components/admin/UnderDevelopment";
import { ThemeProvider } from "./components/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ChatSessionsPage from "./pages/admin/ChatSessionsPage";
import KnowledgeBasePage from "./pages/admin/KnowledgeBasePage";
import AiConfigPage from "./pages/admin/AiConfigPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import AIConfigurationPage from "./pages/admin/AIConfigurationPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import WidgetBuilderPage from "./pages/admin/WidgetBuilderPage";
import SettingsPage from "./pages/admin/SettingsPage";
import NotFound from "./pages/NotFound";
import { ThemeDebugger } from "./components/debug/ThemeDebugger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/theme-debug" element={<div className="container py-10"><ThemeDebugger /></div>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="chat-sessions" element={<ChatSessionsPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="ai-configuration" element={<AiConfigPage />} />
            <Route path="ai-config" element={<AIConfigurationPage />} />
            <Route path="user-management" element={<UserManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Routes for sidebar items */}
            <Route path="widget-builder" element={<WidgetBuilderPage />} />
            <Route path="analytics" element={<UnderDevelopment />} />
            <Route path="embedding" element={<UnderDevelopment />} />
            <Route path="integrations" element={<UnderDevelopment />} />
            
            {/* Catch-all route for any other admin paths */}
            <Route path="*" element={<AdminNotFound />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
