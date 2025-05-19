import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ModelCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-12" />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-16 justify-self-end" />
            <div className="col-span-3">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-20 justify-self-end" />
            <div className="col-span-3">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-16 justify-self-end" />
            <div className="col-span-3">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Skeleton className="h-4 w-20 justify-self-end" />
            <div className="col-span-3">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  );
};