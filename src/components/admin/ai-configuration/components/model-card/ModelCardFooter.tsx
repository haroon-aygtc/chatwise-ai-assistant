import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Check, X, TestTube } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ModelCardFooterProps {
  hasChanges: boolean;
  isUpdating: boolean;
  onReset: () => void;
  onApply: () => void;
  onTest?: () => void;
  showTestButton?: boolean;
}

export const ModelCardFooter = ({
  hasChanges,
  isUpdating,
  onReset,
  onApply,
  onTest,
  showTestButton = false,
}: ModelCardFooterProps) => {
  return (
    <CardFooter className="flex justify-between px-4 py-3 border-t border-muted/30">
      <div>
        {showTestButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTest}
                  className="text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                >
                  <TestTube className="mr-1 h-4 w-4" />
                  Test Model
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Test this model with a sample prompt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-center gap-2">
        {hasChanges ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    disabled={isUpdating}
                    className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors"
                  >
                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Discard all changes and restore original values</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={onApply}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-1 h-4 w-4" />
                        Apply Changes
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Save all changes to this model configuration</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            No unsaved changes
          </span>
        )}
      </div>
    </CardFooter>
  );
};
