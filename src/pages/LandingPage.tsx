import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to ChatSystem
        </h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive platform for managing your chat operations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button size="lg">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
          <Link to="/components">
            <Button size="lg" variant="outline">
              View Components
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
