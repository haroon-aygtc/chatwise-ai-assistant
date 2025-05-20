import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { ShieldX } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function UnauthorizedPage() {
  const { isAuthenticated } = useAuth();

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <div className="p-4 rounded-full bg-destructive/10 mb-4">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              {isAuthenticated ? "Back to Dashboard" : "Go to Home"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Contact Support</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
