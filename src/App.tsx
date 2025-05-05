
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import LandingPage from "@/pages/LandingPage";
import ComponentShowcasePage from "@/pages/ComponentShowcasePage";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/components" element={<ComponentShowcasePage />} />
            
            {/* Protected routes */}
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredPermission="manage users">
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
