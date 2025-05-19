import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ModelCardFooterProps {
  hasChanges: boolean;
  isUpdating: boolean;
  onReset: () => void;
  onApply: () => void;
}

export const ModelCardFooter = ({
  hasChanges,
  isUpdating,
  onReset,
  onApply,
}: ModelCardFooterProps) => {
  return (
    <CardFooter className="flex justify-end gap-2 pt-0">
      {hasChanges && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isUpdating}
          >
            Reset
          </Button>
          <Button size="sm" onClick={onApply} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Apply Changes"
            )}
          </Button>
        </>
      )}
    </CardFooter>
  );
};