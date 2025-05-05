
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIModelManager, BrandingEngineManager, FollowUpManager, KnowledgeBaseManager, RoutingRules, PromptTemplateManager } from "../../components/admin/ai-configuration";
import { ResponseFormatterManager } from "../../components/admin/ai-configuration/response-formats";

const AIConfigurationPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Configuration</h2>
        <p className="text-muted-foreground">
          Configure your AI assistant's core settings and behavior.
        </p>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="bg-background">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="prompts">Prompt Templates</TabsTrigger>
          <TabsTrigger value="formatter">Response Formatter</TabsTrigger>
          <TabsTrigger value="branding">Branding Engine</TabsTrigger>
          <TabsTrigger value="followup">Follow-Up Suggestions</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        <TabsContent value="models" className="space-y-4">
          <AIModelManager />
        </TabsContent>
        <TabsContent value="prompts" className="space-y-4">
          <PromptTemplateManager />
        </TabsContent>
        <TabsContent value="formatter" className="space-y-4">
          <ResponseFormatterManager />
        </TabsContent>
        <TabsContent value="branding" className="space-y-4">
          <BrandingEngineManager />
        </TabsContent>
        <TabsContent value="followup" className="space-y-4">
          <FollowUpManager />
        </TabsContent>
        <TabsContent value="routing" className="space-y-4">
          <RoutingRules />
        </TabsContent>
        <TabsContent value="knowledge" className="space-y-4">
          <KnowledgeBaseManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfigurationPage;
