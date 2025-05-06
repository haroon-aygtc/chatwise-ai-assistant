
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormatSettingsCard } from './FormatSettingsCard';
import { SavedFormatsCard } from './SavedFormatsCard';
import { TestPromptCard } from './TestPromptCard';
import { PreviewCard } from './PreviewCard';
import { FormatPreviewTab } from './FormatPreviewTab';
import * as responseFormatService from '@/services/ai-configuration/responseFormatService';
import { ResponseFormat } from '@/types/ai-configuration';

const ResponseFormatterManager = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [formats, setFormats] = useState<ResponseFormat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormatId, setSelectedFormatId] = useState('');
  const [formatSettings, setFormatSettings] = useState<Partial<ResponseFormat>>({});
  const [testPrompt, setTestPrompt] = useState('How can I help you today?');
  const [testResponse, setTestResponse] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFormats();
  }, []);

  const loadFormats = async () => {
    try {
      setIsLoading(true);
      const data = await responseFormatService.getAllFormats();
      setFormats(data);
      if (data.length > 0 && !selectedFormatId) {
        const defaultFormat = data.find(f => f.isDefault) || data[0];
        setSelectedFormatId(defaultFormat.id);
        setFormatSettings(defaultFormat);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load response formats',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFormat = (format: ResponseFormat) => {
    setSelectedFormatId(format.id);
    setFormatSettings(format);
  };

  const handleNewFormat = () => {
    setSelectedFormatId('');
    setFormatSettings({
      name: 'New Format',
      description: '',
      template: '',
      systemInstructions: '',
      parameters: {},
      isDefault: false,
    });
  };

  const handleSaveFormat = async () => {
    try {
      setIsLoading(true);
      let savedFormat;

      if (selectedFormatId) {
        // Update existing format
        savedFormat = await responseFormatService.updateFormat(selectedFormatId, formatSettings);
        toast({
          title: 'Success',
          description: 'Format updated successfully',
        });
      } else {
        // Create new format
        savedFormat = await responseFormatService.createFormat(formatSettings as Omit<ResponseFormat, 'id'>);
        setSelectedFormatId(savedFormat.id);
        toast({
          title: 'Success',
          description: 'New format created successfully',
        });
      }

      await loadFormats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save format',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFormat = async () => {
    if (!selectedFormatId) return;
    
    try {
      setIsLoading(true);
      await responseFormatService.deleteFormat(selectedFormatId);
      toast({
        title: 'Success',
        description: 'Format deleted successfully',
      });
      setSelectedFormatId('');
      setFormatSettings({});
      await loadFormats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete format',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestFormat = async () => {
    if (!selectedFormatId || !testPrompt) return;
    
    try {
      setIsTestLoading(true);
      const result = await responseFormatService.testFormat(selectedFormatId, testPrompt);
      setTestResponse(result.formatted);
      setActiveTab('preview');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to test format',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Response Format Manager</h2>
          <p className="text-muted-foreground">Create and manage response formats for your AI</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SavedFormatsCard
          formats={formats}
          selectedFormatId={selectedFormatId}
          onSelectFormat={handleSelectFormat}
          onNewFormat={handleNewFormat}
          isLoading={isLoading}
        />

        <div className="lg:col-span-2">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="settings">
              <FormatSettingsCard
                formatSettings={formatSettings}
                setFormatSettings={setFormatSettings}
                handleSave={handleSaveFormat}
                onDelete={handleDeleteFormat}
                isNew={!selectedFormatId}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="preview">
              <FormatPreviewTab
                testPrompt={testPrompt}
                testResponse={testResponse}
                formatSettings={formatSettings}
                onGoToSettings={() => setActiveTab('settings')}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <TestPromptCard
              value={testPrompt}
              onChange={setTestPrompt}
              selectedFormatId={selectedFormatId}
              onTest={handleTestFormat}
              isLoading={isTestLoading}
            />
          </div>

          {testResponse && (
            <div className="mt-6">
              <PreviewCard formattedResponse={testResponse} isLoading={isTestLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseFormatterManager;
