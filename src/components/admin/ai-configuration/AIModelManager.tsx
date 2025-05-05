
import { useState } from "react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Save } from "lucide-react";
import { ModelCard } from "./ModelCard";
import { AddModelDialog } from "./AddModelDialog";
import { RoutingRules } from "./RoutingRules";
import { ModelCardSkeleton } from "./components/ModelCardSkeleton";
import { EmptyModelsState } from "./components/EmptyModelsState";
import { AddModelCard } from "./components/AddModelCard";
import { useAIModels } from "./hooks/useAIModels";
import { AIModel } from "@/types/ai-configuration";

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
            .map((_, i) => <ModelCardSkeleton key={i} />)
        ) : models && models.length > 0 ? (
          <>
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onUpdate={async (id, updates) => updateModel(updates)}
                isUpdating={isSaving}
              />
            ))}
            <AddModelCard onAddModel={() => setShowAddModelDialog(true)} />
          </>
        ) : (
          <EmptyModelsState onAddModel={() => setShowAddModelDialog(true)} />
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
