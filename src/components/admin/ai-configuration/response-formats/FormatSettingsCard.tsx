
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Trash } from 'lucide-react';
import { FormatSettingsCardProps } from './types';

export function FormatSettingsCard({
  formatSettings,
  setFormatSettings,
  handleSave,
  onDelete,
  isNew = false,
  isLoading = false
}: FormatSettingsCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateSettings = (field: keyof typeof formatSettings, value: any) => {
    setFormatSettings({ ...formatSettings, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Create New Format' : 'Edit Format'}</CardTitle>
        <CardDescription>Configure how responses are formatted</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Format Name</Label>
          <Input
            id="name"
            value={formatSettings.name || ''}
            onChange={(e) => updateSettings('name', e.target.value)}
            placeholder="e.g., Standard Format"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formatSettings.description || ''}
            onChange={(e) => updateSettings('description', e.target.value)}
            placeholder="Describe how this format works"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">Response Template</Label>
          <Textarea
            id="template"
            value={formatSettings.template || ''}
            onChange={(e) => updateSettings('template', e.target.value)}
            placeholder="Template with placeholders like {{content}}"
            rows={6}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Use variables like {{content}}, {{sources}}, etc. in your template
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="systemInstructions">System Instructions</Label>
          <Textarea
            id="systemInstructions"
            value={formatSettings.systemInstructions || ''}
            onChange={(e) => updateSettings('systemInstructions', e.target.value)}
            placeholder="Instructions for the AI to follow when using this format"
            rows={4}
          />
        </div>

        <div className="flex justify-between mt-6">
          {!isNew && onDelete && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onDelete}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </>
          )}

          <Button onClick={handleSave} disabled={isLoading || !formatSettings.name}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isNew ? 'Create Format' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
