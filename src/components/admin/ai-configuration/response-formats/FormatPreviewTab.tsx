
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { FormatPreviewTabProps } from './types';

export function FormatPreviewTab({
  testPrompt,
  testResponse,
  formatSettings,
  onGoToSettings,
}: FormatPreviewTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Format Preview</CardTitle>
            <CardDescription>
              See how your format works with the test prompt
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onGoToSettings}>
            <Settings className="h-4 w-4 mr-1" /> Format Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Input Prompt:</h4>
          <div className="bg-muted p-3 rounded-md text-sm">
            {testPrompt}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Format Template:</h4>
          <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
            {formatSettings.template || "No template defined"}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Formatted Response:</h4>
          <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
            {testResponse || "No response generated yet"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
