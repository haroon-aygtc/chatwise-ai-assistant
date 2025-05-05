
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponseFormat } from "@/types/ai-configuration";
import { Check, Loader2 } from "lucide-react";

export interface SavedFormatsCardProps {
  formats: ResponseFormat[];
  onSelectFormat: (format: ResponseFormat) => void;
  onSetDefault: (id: string) => Promise<void>;
  isSettingDefault: boolean;
  isLoading?: boolean;
}

export function SavedFormatsCard({
  formats,
  onSelectFormat,
  onSetDefault,
  isSettingDefault,
  isLoading = false
}: SavedFormatsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Saved Formats</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : formats.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No formats created yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="p-2">
              {formats.map((format) => (
                <div
                  key={format.id}
                  className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => onSelectFormat(format)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{format.name}</span>
                        {format.isDefault && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format.description || "No description"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {format.format}
                        </span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {format.length}
                        </span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {format.tone}
                        </span>
                      </div>
                    </div>
                    {!format.isDefault && (
                      <button
                        className="text-xs text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetDefault(format.id);
                        }}
                        disabled={isSettingDefault}
                      >
                        {isSettingDefault ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Set Default"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
