import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AIConfigSidebar from "@/components/admin/AIConfigSidebar";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import { ConfigurationManager } from "@/components/admin/ai-configuration/ConfigurationManager";

const AIConfigurationPage = () => {
  const location = useLocation();
  const isRootPath = location.pathname === "/admin/ai-configuration";

  return (
    <ProtectedRoute requiredPermissions={["manage_ai_configuration"]}>
      <div className="flex h-full">
        <AIConfigSidebar />
        <div className="flex-1 p-6 overflow-auto">
          {isRootPath ? <ConfigurationManager /> : <Outlet />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AIConfigurationPage;
