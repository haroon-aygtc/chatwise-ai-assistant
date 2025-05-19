import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIModel, PromptTemplate } from "@/types/ai-configuration";
import { Loader2, Play, Save, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OneClickTestingProps {
  template: PromptTemplate;
  aiModels: AIModel[];
  onSaveAsTemplate?: (content: string) => void;
}

export const OneClickTesting = ({
  template,
  aiModels,
  onSaveAsTemplate,
}: OneClickTestingProps) => {
  const [selectedModel, setSelectedModel] = useState<string>(
    aiModels.length > 0 ? aiModels[0].id : "",
  );
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {},
  );
  const [processedPrompt, setProcessedPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [feedback, setFeedback] = useState<"none" | "positive" | "negative">(
    "none",
  );

  // Process the template with variable values
  const processTemplate = () => {
    let processed = template.template;

    // Replace variables with their values
    if (template.variables) {
      template.variables.forEach((variable) => {
        const value =
          variableValues[variable.name] || variable.defaultValue || "";
        const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, "g");
        processed = processed.replace(regex, value);
      });
    }

    setProcessedPrompt(processed);
    return processed;
  };

  // Handle variable value change
  const handleVariableChange = (name: string, value: string) => {
    setVariableValues({
      ...variableValues,
      [name]: value,
    });
  };

  // Test the template with the selected AI model
  const testTemplate = async () => {
    const prompt = processTemplate();
    setIsLoading(true);
    setActiveTab("response");

    try {
      // This would be a real API call in production
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        const selectedModelObj = aiModels.find((m) => m.id === selectedModel);
        const modelName = selectedModelObj ? selectedModelObj.name : "AI Model";

        setResponse(
          `This is a simulated response from ${modelName} based on your prompt.\n\n` +
            `The AI would process your input: "${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}"\n\n` +
            `In a production environment, this would make a real API call to the selected AI provider.`,
        );
        setIsLoading(false);
      }, 1500);

      // In production, you would use a real API call like this:
      // const response = await apiService.post('/ai/test-template', {
      //   modelId: selectedModel,
      //   prompt,
      // });
      // setResponse(response.data.result);
    } catch (error) {
      console.error("Error testing template:", error);
      setResponse("An error occurred while testing the template.");
      setIsLoading(false);
    }
  };

  // Handle feedback
  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    // In production, you would send this feedback to your API
    // apiService.post('/ai/feedback', {
    //   modelId: selectedModel,
    //   templateId: template.id,
    //   prompt: processedPrompt,
    //   response,
    //   feedback: type,
    // });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Test "{template.name}" Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select AI Model
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {template.variables && template.variables.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Template Variables</h3>
                {template.variables.map((variable) => (
                  <div key={variable.name} className="grid grid-cols-1 gap-2">
                    <label className="text-sm flex items-center gap-2">
                      {variable.name}
                      {variable.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={variable.type === "number" ? "number" : "text"}
                        value={variableValues[variable.name] || ""}
                        onChange={(e) =>
                          handleVariableChange(variable.name, e.target.value)
                        }
                        placeholder={variable.description || variable.name}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {variable.description && (
                      <p className="text-xs text-muted-foreground">
                        {variable.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={processTemplate}>
            Preview Prompt
          </Button>
          <Button onClick={testTemplate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Test Template
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Processed Prompt</TabsTrigger>
          <TabsTrigger value="response">AI Response</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Processed Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={processedPrompt}
                readOnly
                className="min-h-[200px] font-mono text-sm"
                placeholder="Click 'Preview Prompt' to see how your template will look with the provided variable values."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="response" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex justify-between items-center">
                <span>AI Response</span>
                {response && !isLoading && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant={feedback === "positive" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFeedback("positive")}
                      className="h-8 px-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        feedback === "negative" ? "destructive" : "outline"
                      }
                      size="sm"
                      onClick={() => handleFeedback("negative")}
                      className="h-8 px-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Textarea
                  value={response}
                  readOnly
                  className="min-h-[200px] text-sm"
                  placeholder="AI response will appear here after testing."
                />
              )}
            </CardContent>
            {response && !isLoading && onSaveAsTemplate && (
              <CardFooter>
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={() => onSaveAsTemplate(response)}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Response as Template
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OneClickTesting;
