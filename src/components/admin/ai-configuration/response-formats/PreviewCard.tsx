
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PreviewCardProps } from './types';

export function PreviewCard({ formattedResponse, isLoading = false }: PreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formatted Response Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
            {formattedResponse || "No response yet. Try testing a prompt."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
