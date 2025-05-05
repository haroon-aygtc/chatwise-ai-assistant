import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-3 text-muted-foreground">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
