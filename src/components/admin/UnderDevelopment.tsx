import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

const UnderDevelopment = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.split('-').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'This page';

  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="text-center max-w-md">
        <div className="bg-amber-100 dark:bg-amber-950/30 p-3 rounded-full inline-flex mb-6">
          <Construction className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Under Development</h1>
        <p className="text-muted-foreground mb-6">
          {pageName} is currently under development and will be available soon.
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

export default UnderDevelopment;