
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export const ModelCardSkeleton: React.FC = () => {
  return (
    <Card className="opacity-70">
      <CardHeader>
        <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-9 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
            <div className="h-9 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="h-9 w-16 bg-muted rounded animate-pulse"></div>
        <div className="h-9 w-16 bg-muted rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
};
