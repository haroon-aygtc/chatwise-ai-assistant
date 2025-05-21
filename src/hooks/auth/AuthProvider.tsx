import { createContext, useContext, ReactNode } from "react";
import { useAuth, AuthHookResult } from "./useAuth";

// Create auth context
const AuthContext = createContext<AuthHookResult | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuthContext(): AuthHookResult {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
