import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <h1 className="text-9xl font-extrabold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </PublicLayout>
  );
}
