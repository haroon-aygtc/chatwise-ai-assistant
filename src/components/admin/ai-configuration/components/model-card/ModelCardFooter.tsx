
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface ModelCardFooterProps {
  hasChanges: boolean;
  isUpdating: boolean;
  onReset: () => void;
  onApply: () => void;
}

export const ModelCardFooter: React.FC<ModelCardFooterProps> = ({
  hasChanges,
  isUpdating,
  onReset,
  onApply,
}) => {
  return (
    <CardFooter className="flex justify-between">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={!hasChanges || isUpdating}
      >
        Reset
      </Button>
      <Button onClick={onApply} disabled={!hasChanges || isUpdating}>
        {isUpdating ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Applying...
          </>
        ) : (
          "Apply"
        )}
      </Button>
    </CardFooter>
  );
};
