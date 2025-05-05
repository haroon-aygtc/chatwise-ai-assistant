
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const AdminNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Admin 404 Error: User attempted to access non-existent admin route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="text-center max-w-md">
        <div className="bg-amber-100 dark:bg-amber-950/30 p-3 rounded-full inline-flex mb-6">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The admin page you're looking for doesn't exist or is still under development.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/admin"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;
