
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavedFormatsCard } from './SavedFormatsCard';
import { FormatSettingsCard } from './FormatSettingsCard';
import { TestPromptCard } from './TestPromptCard';
import { PreviewCard } from './PreviewCard';
import { FormatPreviewTab } from './FormatPreviewTab';
import { useQuery } from '@tanstack/react-query';
import * as responseFormatServiceImport from "@/services/ai-configuration/responseFormatService";

export default function ResponseFormatterManager() {
  const [activeTab, setActiveTab] = useState('formats');
  const [testPrompt, setTestPrompt] = useState("Explain how to make a good cup of coffee in 3 steps");
  const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);
  
  const { data: formats } = useQuery({
    queryKey: ['responseFormats'],
    queryFn: () => responseFormatServiceImport.getFormats(),
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Response Formats</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="formats">Saved Formats</TabsTrigger>
          <TabsTrigger value="settings">Format Settings</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="formats" className="space-y-4">
          <SavedFormatsCard formats={formats?.data || []} onSelectFormat={setSelectedFormatId} />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <FormatSettingsCard />
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <FormatPreviewTab>
            <div className="grid gap-4 md:grid-cols-2">
              <TestPromptCard 
                prompt={testPrompt} 
                onPromptChange={setTestPrompt} 
                selectedFormatId={selectedFormatId}
              />
              <PreviewCard prompt={testPrompt} formatId={selectedFormatId} />
            </div>
          </FormatPreviewTab>
        </TabsContent>
      </Tabs>
    </div>
  );
}
