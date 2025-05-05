
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormatSettingsCard } from './FormatSettingsCard';
import { SavedFormatsCard } from './SavedFormatsCard';
import { TestPromptCard } from './TestPromptCard';
import { PreviewCard } from './PreviewCard';
import { FormatPreviewTab } from './FormatPreviewTab';
import { responseFormatService } from '@/services/response-format';
import { ResponseFormat } from '@/types/ai-configuration';
import { useToast } from '@/components/ui/use-toast';

const ResponseFormatterManager = () => {
  const { toast } = useToast();
  const [formatList, setFormatList] = useState<ResponseFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ResponseFormat | null>(null);
  const [testInput, setTestInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    fetchFormats();
  }, []);

  const fetchFormats = async () => {
    setIsLoading(true);
    try {
      const formats = await responseFormatService.getAllResponseFormats();
      setFormatList(formats);
      
      // Select the default format if available
      const defaultFormat = formats.find(format => format.isDefault);
      if (defaultFormat) {
        setSelectedFormat(defaultFormat);
      } else if (formats.length > 0) {
        setSelectedFormat(formats[0]);
      }
    } catch (error) {
      console.error('Error fetching response formats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load response formats',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatSelect = (format: ResponseFormat) => {
    setSelectedFormat(format);
  };

  const handleFormatChange = async (updatedFormat: ResponseFormat) => {
    try {
      await responseFormatService.updateResponseFormat(updatedFormat.id, updatedFormat);
      setFormatList(prev => 
        prev.map(format => format.id === updatedFormat.id ? updatedFormat : format)
      );
      setSelectedFormat(updatedFormat);
      toast({
        title: 'Success',
        description: 'Response format updated successfully',
      });
    } catch (error) {
      console.error('Error updating format:', error);
      toast({
        title: 'Error',
        description: 'Failed to update response format',
        variant: 'destructive',
      });
    }
  };

  const handleCreateFormat = async (newFormat: Omit<ResponseFormat, 'id'>) => {
    try {
      const createdFormat = await responseFormatService.createResponseFormat(newFormat);
      setFormatList(prev => [...prev, createdFormat]);
      setSelectedFormat(createdFormat);
      toast({
        title: 'Success',
        description: 'New response format created',
      });
    } catch (error) {
      console.error('Error creating format:', error);
      toast({
        title: 'Error',
        description: 'Failed to create response format',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFormat = async (id: string) => {
    try {
      await responseFormatService.deleteResponseFormat(id);
      const updatedFormats = formatList.filter(format => format.id !== id);
      setFormatList(updatedFormats);
      
      if (selectedFormat?.id === id) {
        setSelectedFormat(updatedFormats.length > 0 ? updatedFormats[0] : null);
      }
      
      toast({
        title: 'Success',
        description: 'Response format deleted',
      });
    } catch (error) {
      console.error('Error deleting format:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete response format',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await responseFormatService.setDefaultResponseFormat(id);
      setFormatList(prev => 
        prev.map(format => ({
          ...format,
          isDefault: format.id === id
        }))
      );
      toast({
        title: 'Success',
        description: 'Default response format updated',
      });
    } catch (error) {
      console.error('Error setting default format:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default response format',
        variant: 'destructive',
      });
    }
  };

  const handleTestFormat = async () => {
    if (!selectedFormat || !testInput) return;
    
    setIsLoading(true);
    try {
      const result = await responseFormatService.testResponseFormat(
        selectedFormat.id,
        testInput
      );
      
      // Use the formatted response from the API
      setFormattedOutput(result.formatted);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error testing format:', error);
      toast({
        title: 'Error',
        description: 'Failed to test response format',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Response Formatter</h2>
        <p className="text-muted-foreground">
          Customize how AI responses are structured and formatted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SavedFormatsCard 
            formats={formatList}
            selectedFormat={selectedFormat}
            onFormatSelect={handleFormatSelect}
            onCreateFormat={handleCreateFormat}
            onDeleteFormat={handleDeleteFormat}
            onSetDefault={handleSetDefault}
            isLoading={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Card className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="p-6 space-y-6">
                <FormatSettingsCard 
                  selectedFormat={selectedFormat}
                  onFormatChange={handleFormatChange}
                  isLoading={isLoading}
                />
                
                <TestPromptCard 
                  testInput={testInput}
                  onInputChange={setTestInput}
                  onTestFormat={handleTestFormat}
                  isLoading={isLoading}
                  disabled={!selectedFormat}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="p-6">
                <FormatPreviewTab
                  originalInput={testInput}
                  formattedOutput={formattedOutput}
                  formatName={selectedFormat?.name || 'No format selected'}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ResponseFormatterManager };
