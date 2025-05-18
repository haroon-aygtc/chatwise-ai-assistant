
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavedFormatCardProps } from './types';

export function SavedFormatsCard({
  formats,
  selectedFormatId,
  onSelectFormat,
  onNewFormat,
  isLoading = false
}: SavedFormatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Saved Formats</CardTitle>
        <Button size="sm" onClick={onNewFormat} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-1" /> New Format
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && formats.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : formats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No formats available</p>
            <p className="text-sm mt-2">Create your first format to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {formats.map((format) => (
              <div
                key={format.id}
                className={cn(
                  "p-3 rounded-md cursor-pointer flex items-center justify-between",
                  selectedFormatId === format.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                )}
                onClick={() => onSelectFormat(format)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{format.name}</h3>
                    {format.isDefault && <Badge variant="outline">Default</Badge>}
                  </div>
                  {format.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{format.description}</p>
                  )}
                </div>
                {selectedFormatId === format.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
