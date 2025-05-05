
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bot,
  MessageSquare,
  Wand2,
  Zap,
  Save,
  Database,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import AIModelManager from "./ai-configuration/AIModelManager";
import PromptTemplateManager from "./ai-configuration/PromptTemplateManager";

const AIConfiguration = () => {
  const [testPrompt, setTestPrompt] = useState("How can you help me?");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTest = () => {
    setIsTesting(true);
    // Simulate API call
    setTimeout(() => {
      setTestResponse(
        "I can help you with a variety of tasks! As your AI assistant, I can answer questions about your account, provide information about our products and services, help troubleshoot common issues, and connect you with a human agent if needed. Just let me know what you're looking for, and I'll do my best to assist you in a friendly and professional manner.",
      );
      setIsTesting(false);
    }, 1500);
  };

  const handleSaveChanges = () => {
    // Implement save functionality
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Configuration</h1>
          <p className="text-muted-foreground">
            Configure AI models, prompts, and response formatting
          </p>
        </div>
        <Button onClick={handleSaveChanges} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="models">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="models">
            <Bot className="mr-2 h-4 w-4" /> AI Models
          </TabsTrigger>
          <TabsTrigger value="knowledge-base">
            <Database className="mr-2 h-4 w-4" /> Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="prompts">
            <MessageSquare className="mr-2 h-4 w-4" /> Prompt Templates
          </TabsTrigger>
          <TabsTrigger value="formatting">
            <Wand2 className="mr-2 h-4 w-4" /> Response Formatting
          </TabsTrigger>
          <TabsTrigger value="testing">
            <Zap className="mr-2 h-4 w-4" /> Testing
          </TabsTrigger>
        </TabsList>

        {/* AI Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <AIModelManager />
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Integration</CardTitle>
              <CardDescription>
                Connect your AI to your knowledge sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Knowledge Base Manager Coming Soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompt Templates Tab */}
        <TabsContent value="prompts" className="space-y-4">
          <PromptTemplateManager />
        </TabsContent>

        {/* Response Formatting Tab */}
        <TabsContent value="formatting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Formatting</CardTitle>
              <CardDescription>
                Configure how AI responses are structured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Response Formatter Coming Soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Response Testing</CardTitle>
              <CardDescription>
                Test your AI configuration with sample prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Test Prompt</Label>
                  <Textarea
                    placeholder="Enter a test prompt"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleTest}
                    disabled={isTesting || !testPrompt.trim()}
                  >
                    {isTesting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" /> Test Response
                      </>
                    )}
                  </Button>
                </div>

                {testResponse && (
                  <div className="mt-4">
                    <Label>AI Response</Label>
                    <div className="mt-2 p-4 border rounded-md bg-muted/20">
                      <p>{testResponse}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfiguration;
