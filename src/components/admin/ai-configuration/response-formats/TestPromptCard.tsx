
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, Loader2 } from 'lucide-react';
import { TestPromptCardProps } from './types';

export function TestPromptCard({
  value,
  onChange,
  selectedFormatId,
  onTest,
  isLoading = false
}: TestPromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Format</CardTitle>
        <CardDescription>Enter a prompt to test your response format</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter a test prompt..."
            rows={4}
          />
          <div className="flex justify-end">
            <Button 
              onClick={onTest} 
              disabled={isLoading || !selectedFormatId || !value.trim()}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="mr-2 h-4 w-4" />
              )}
              Test Format
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
