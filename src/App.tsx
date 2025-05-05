
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLayout } from "./components/admin/AdminLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ChatSessionsPage from "./pages/admin/ChatSessionsPage";
import KnowledgeBasePage from "./pages/admin/KnowledgeBasePage";
import AiConfigPage from "./pages/admin/AiConfigPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="chat-sessions" element={<ChatSessionsPage />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="ai-configuration" element={<AiConfigPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="settings" element={<h1>Settings</h1>} />
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
