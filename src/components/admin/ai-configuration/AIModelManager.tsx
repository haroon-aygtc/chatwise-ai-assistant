
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Save, AlertCircle, RefreshCw, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import types from the centralized types file
import { AIModel, RoutingRule } from "@/types/ai-configuration";

// MOCK COMPONENTS – Replace these with real components if available
import { ModelCard } from "./ModelCard";
import { RoutingRules } from "./RoutingRules";
import { AddModelDialog } from "./AddModelDialog";

// ✅ MOCK HOOK: Simulates fetching AI models & routing rules
function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: "model-1",
      name: "ChatGPT-4",
      description: "OpenAI's GPT-4 Model",
      provider: "OpenAI",
      version: "4.0",
      isActive: true,
      configuration: {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
    {
      id: "model-2",
      name: "Gemini-Pro",
      description: "Google's Gemini Pro Model",
      provider: "Google",
      version: "Pro",
      isActive: true,
      configuration: {
        temperature: 0.6,
        maxTokens: 1000,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
  ]);

  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([
    {
      id: "rule-1",
      name: "Legal Routing",
      modelId: "model-1",
      description: "Route legal queries to ChatGPT-4",
      conditions: [
        {
          field: "message",
          operator: "contains",
          value: "legal",
        },
      ],
      priority: 1,
    },
  ]);

  return {
    models,
    routingRules,
    isLoading: false,
    isSaving: false,
    error: null,
    updateModel: (updatedModel: Partial<AIModel>) => {
      setModels((prev) =>
        prev.map((m) => (m.id === updatedModel.id ? { ...m, ...updatedModel } : m))
      );
    },
    updateRoutingRules: setRoutingRules,
    addRoutingRule: (rule: Omit<RoutingRule, "id">) =>
      setRoutingRules((prev) => [
        ...prev,
        {
          id: `rule-${prev.length + 1}`,
          ...rule,
        },
      ]),
    deleteRoutingRule: (id: string) =>
      setRoutingRules((prev) => prev.filter((r) => r.id !== id)),
    saveAllChanges: async () => {
      console.log("Saving models & rules...");
      return true;
    },
    refreshData: () => {
      console.log("Refreshing data...");
    },
    hasChanges: true,
  };
}

// ✅ MAIN COMPONENT
export interface AIModelManagerProps {
  onSave?: (models: AIModel[]) => void;
  standalone?: boolean;
}

export const AIModelManager = ({
  onSave,
  standalone = false,
}: AIModelManagerProps) => {
  const {
    models,
    routingRules,
    isLoading,
    isSaving,
    error,
    updateModel,
    updateRoutingRules,
    addRoutingRule,
    deleteRoutingRule,
    saveAllChanges,
    refreshData,
    hasChanges,
  } = useAIModels();

  const [showAddModelDialog, setShowAddModelDialog] = useState(false);

  const handleSaveChanges = async () => {
    const success = await saveAllChanges();
    if (success && onSave) {
      onSave(models);
    }
  };

  const handleAddModelSuccess = (newModel: AIModel) => {
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Model Manager</h1>
            <p className="text-muted-foreground">
              Configure and manage AI models for your chat system
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={isLoading || isSaving}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Failed to load AI models"}
          </AlertDescription>
        </Alert>
      )}

      {/* MODEL CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="opacity-70">
                <CardHeader>
                  <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                      <div className="h-9 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                      <div className="h-9 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="h-9 w-16 bg-muted rounded animate-pulse"></div>
                  <div className="h-9 w-16 bg-muted rounded animate-pulse"></div>
                </CardFooter>
              </Card>
            ))
        ) : models && models.length > 0 ? (
          models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onUpdate={async (id, updates) => updateModel(updates)}
              isUpdating={isSaving}
            />
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No AI Models Configured
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                You haven't added any AI models yet. Add your first model to get
                started with AI-powered chat.
              </p>
              <Button onClick={() => setShowAddModelDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Model
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ADD MODEL CARD */}
        {models && models.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-muted-foreground" /> Add Model
              </CardTitle>
              <CardDescription>Configure a new AI model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] flex items-center justify-center border-2 border-dashed rounded-md">
                <div className="text-center">
                  <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Click to add a new AI model
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowAddModelDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Model
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ROUTING RULES */}
      {models && models.length > 0 && (
        <RoutingRules
          models={models}
          rules={routingRules}
          onAddRule={(rule) => addRoutingRule(rule)}
          onUpdateRules={(rules) => updateRoutingRules(rules)}
          onDeleteRule={deleteRoutingRule}
        />
      )}

      {/* ADD MODEL DIALOG */}
      <AddModelDialog
        open={showAddModelDialog}
        onOpenChange={setShowAddModelDialog}
        onSuccess={handleAddModelSuccess}
      />
    </div>
  );
};

export default AIModelManager;
