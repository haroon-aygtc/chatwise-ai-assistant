
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <ShieldX className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold">Access Denied</h1>
        
        <p className="text-muted-foreground">
          You don't have permission to access this page. Please contact your administrator for access.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/dashboard">
            <Button variant="default">
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
