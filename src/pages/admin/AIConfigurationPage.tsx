import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AIModelManager, 
  BrandingEngineManager, 
  FollowUpManager, 
  KnowledgeBaseManager, 
  RoutingRules, 
  PromptTemplateManager,
  DataSourcesManager
} from "../../components/admin/ai-configuration";
import { ResponseFormatterManager } from "../../components/admin/ai-configuration/response-formats";
import { useToast } from "@/components/ui/use-toast";
import { AIModel, RoutingRule } from "@/types/ai-configuration";
import * as aiModelService from "@/services/ai-configuration/aiModelService";

const AIConfigurationPage = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<AIModel[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch AI models and routing rules
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedModels = await aiModelService.getAllModels();
        const fetchedRules = await aiModelService.getRoutingRules();
        setModels(fetchedModels);
        setRoutingRules(fetchedRules);
      } catch (error) {
        console.error("Error fetching AI configuration data:", error);
        toast({
          title: "Error",
          description: "Failed to load AI configuration data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle adding a new routing rule
  const handleAddRule = (rule: Omit<RoutingRule, "id">) => {
    return aiModelService.createRoutingRule(rule);
  };

  // Handle updating routing rules
  const handleUpdateRules = async (rules: RoutingRule[]) => {
    try {
      // Process each rule that needs updating
      await Promise.all(
        rules.map((rule) => aiModelService.updateRoutingRule(rule.id, rule))
      );
      setRoutingRules(rules);
      return true;
    } catch (error) {
      console.error("Error updating routing rules:", error);
      toast({
        title: "Error",
        description: "Failed to update routing rules",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle deleting a routing rule
  const handleDeleteRule = async (id: string) => {
    try {
      await aiModelService.deleteRoutingRule(id);
      setRoutingRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
    } catch (error) {
      console.error(`Error deleting routing rule ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete routing rule",
        variant: "destructive",
      });
    }
  };

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
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
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
        <TabsContent value="data-sources" className="space-y-4">
          <DataSourcesManager />
        </TabsContent>
        <TabsContent value="knowledge" className="space-y-4">
          <KnowledgeBaseManager />
        </TabsContent>
        <TabsContent value="routing" className="space-y-4">
          <RoutingRules 
            models={models}
            rules={routingRules}
            onAddRule={handleAddRule}
            onUpdateRules={handleUpdateRules}
            onDeleteRule={handleDeleteRule}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfigurationPage;
