
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAiConfigs, mockPromptTemplates } from "@/mock/aiConfigs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Check, Settings, Clipboard } from "lucide-react";
import { format } from "date-fns";

export default function AiConfigPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-card">
        <h1 className="text-2xl font-bold">AI Configuration</h1>
        <p className="text-muted-foreground">Manage AI models, prompts, and response templates</p>
      </div>
      
      <div className="p-6 overflow-auto flex-1">
        <Tabs defaultValue="models" className="h-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="prompts">Prompt Templates</TabsTrigger>
            <TabsTrigger value="responses">Response Formats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="h-full">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">AI Model Configurations</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Configuration
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockAiConfigs.map(config => (
                <Card key={config.id} className="overflow-hidden">
                  <CardHeader className="relative">
                    <div className="flex justify-between items-center">
                      <CardTitle>{config.name}</CardTitle>
                      {config.isDefault && (
                        <Badge className="bg-green-500">Default</Badge>
                      )}
                    </div>
                    <CardDescription>Model: {config.model}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">System Prompt</h4>
                      <div className="p-3 bg-muted rounded-md text-sm overflow-y-auto max-h-32">
                        {config.systemPrompt}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Temperature</h4>
                        <p className="text-sm">{config.temperature}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Max Tokens</h4>
                        <p className="text-sm">{config.maxTokens}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Updated {format(new Date(config.updatedAt), "MMM d, yyyy")}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        
                        {!config.isDefault && (
                          <Button variant="default" size="sm">
                            <Check className="mr-1 h-3 w-3" />
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="prompts" className="h-full">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Prompt Templates</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPromptTemplates.map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Template Content</h4>
                      <div className="p-3 bg-muted rounded-md text-sm overflow-y-auto max-h-32">
                        {template.content}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}
                      </span>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="responses" className="h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-xl font-semibold mb-2">Response Format Templates</h3>
                <p className="text-muted-foreground mb-6">
                  Create templates for how AI responses should be structured and formatted for different use cases.
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create First Template
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
