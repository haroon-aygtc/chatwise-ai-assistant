import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIModel, RoutingRule } from "@/types/ai-configuration";
import { EditRuleDialog } from "./EditRuleDialog";

interface RoutingRulesProps {
  models: AIModel[];
  rules: RoutingRule[];
  onAddRule: (rule: Omit<RoutingRule, "id">) => any;
  onUpdateRules: (rules: RoutingRule[]) => Promise<any>;
  onDeleteRule: (id: string) => void;
}

export const RoutingRules = ({
  models,
  rules,
  onAddRule,
  onUpdateRules,
  onDeleteRule,
}: RoutingRulesProps) => {
  const [defaultModel, setDefaultModel] = useState(
    models.find((m) => m.isActive)?.id || models[0]?.id || "",
  );
  const [fallbackModel, setFallbackModel] = useState(
    models.length > 1 ? models[1].id : models[0]?.id || "",
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentRule, setCurrentRule] = useState<RoutingRule | null>(null);

  const handleEditRule = (rule: RoutingRule) => {
    setCurrentRule(rule);
    setShowEditDialog(true);
  };

  const handleAddRule = () => {
    // Create a new rule template
    const newRule: Omit<RoutingRule, "id"> = {
      name: "New Rule",
      description:
        "Route to " + models.find((m) => m.id === defaultModel)?.name,
      modelId: defaultModel,
      conditions: [
        {
          field: "message",
          operator: "contains",
          value: "",
        },
      ],
      priority: rules.length + 1,
    };

    setCurrentRule(onAddRule(newRule) as RoutingRule);
    setShowEditDialog(true);
  };

  const handleSaveRule = (updatedRule: RoutingRule) => {
    const updatedRules = rules.map((rule) =>
      rule.id === updatedRule.id ? updatedRule : rule,
    );
    onUpdateRules(updatedRules);
    setShowEditDialog(false);
    setCurrentRule(null);
  };

  const handleDeleteRule = (id: string) => {
    onDeleteRule(id);
  };

  const handleDefaultModelChange = (value: string) => {
    setDefaultModel(value);
  };

  const handleFallbackModelChange = (value: string) => {
    setFallbackModel(value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Model Routing Rules</CardTitle>
          <CardDescription>Configure when to use each AI model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Default Model</Label>
                <Select
                  value={defaultModel}
                  onValueChange={handleDefaultModelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} {model.version ? `(${model.version})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fallback Model</Label>
                <Select
                  value={fallbackModel}
                  onValueChange={handleFallbackModelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fallback model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} {model.version ? `(${model.version})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Routing Rules</Label>
              <div className="border rounded-md">
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 border-b flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No routing rules defined yet. Add a rule to get started.
                  </div>
                )}
                <div className="p-4 flex items-center justify-center">
                  <Button variant="outline" onClick={handleAddRule}>
                    Add New Rule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentRule && (
        <EditRuleDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          rule={currentRule}
          models={models}
          onSave={handleSaveRule}
        />
      )}
    </>
  );
};
